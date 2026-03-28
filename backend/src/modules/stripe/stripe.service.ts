import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-02-25.clover',
    });
  }

  async createCheckoutSession(tenantId: string, userId: string, priceId: string, successUrl: string, cancelUrl: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    let customerId = tenant.stripeCustomerId;
    if (!customerId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { tenantId },
      });
      customerId = customer.id;
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { tenantId },
      locale: 'pt-BR',
      allow_promotion_codes: true,
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch {
      throw new BadRequestException('Webhook inválido');
    }

    switch (event.type) {

      // ── Checkout concluído: primeira assinatura ────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.metadata?.tenantId;
        if (tenantId && session.subscription) {
          const sub = await this.stripe.subscriptions.retrieve(session.subscription as string) as any;
          const plan = this.getPlanFromPriceId(sub.items.data[0].price.id);
          const periodEnd = this.getPeriodEnd(sub);
          await this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
              plan,
              status: 'active',
              subscriptionStatus: sub.status,
              stripeSubscriptionId: session.subscription as string,
              currentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      // ── Fatura paga: renovação mensal/anual ────────────────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription;
        if (!subscriptionId) break;
        const sub = await this.stripe.subscriptions.retrieve(subscriptionId) as any;
        const tenant = await this.prisma.tenant.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (tenant) {
          const plan = this.getPlanFromPriceId(sub.items.data[0].price.id);
          const periodEnd = this.getPeriodEnd(sub);
          await this.prisma.tenant.update({
            where: { id: tenant.id },
            data: {
              plan,
              status: 'active',
              subscriptionStatus: 'active',
              currentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      // ── Falha no pagamento ─────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const tenant = await this.prisma.tenant.findFirst({
          where: { stripeCustomerId: invoice.customer as string },
        });
        if (tenant) {
          await this.prisma.tenant.update({
            where: { id: tenant.id },
            data: { status: 'suspended', subscriptionStatus: 'past_due' },
          });
        }
        break;
      }

      // ── Assinatura atualizada: mudança de plano, status, etc. ──────────────
      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const tenant = await this.prisma.tenant.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (tenant) {
          const plan = this.getPlanFromPriceId(sub.items.data[0].price.id);
          const periodEnd = this.getPeriodEnd(sub);
          const tenantStatus = ['active', 'trialing'].includes(sub.status) ? 'active' : 'suspended';
          await this.prisma.tenant.update({
            where: { id: tenant.id },
            data: {
              plan,
              status: tenantStatus,
              subscriptionStatus: sub.status,
              currentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      // ── Assinatura cancelada ───────────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const tenant = await this.prisma.tenant.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (tenant) {
          await this.prisma.tenant.update({
            where: { id: tenant.id },
            data: {
              plan: 'free',
              status: 'active',
              subscriptionStatus: 'canceled',
              stripeSubscriptionId: null,
              currentPeriodEnd: null,
            },
          });
        }
        break;
      }
    }

    return { received: true };
  }

  async createPortalSession(tenantId: string, returnUrl: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant.stripeCustomerId) throw new BadRequestException('Sem assinatura ativa');

    const session = await this.stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  }

  async getSubscriptionInfo(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    return {
      plan: tenant.plan,
      status: tenant.status,
      subscriptionStatus: tenant.subscriptionStatus,
      currentPeriodEnd: tenant.currentPeriodEnd,
      hasStripe: !!tenant.stripeCustomerId,
    };
  }

  private getPeriodEnd(sub: any): Date | null {
    // In Stripe API 2026+, current_period_end moved to items level
    const ts = sub.items?.data?.[0]?.current_period_end
      ?? sub.current_period_end
      ?? null;
    return ts ? new Date(ts * 1000) : null;
  }

  private getPlanFromPriceId(priceId: string): 'monthly' | 'annual' | 'free' {
    if (priceId === process.env.STRIPE_PRICE_MONTHLY) return 'monthly';
    if (priceId === process.env.STRIPE_PRICE_ANNUAL) return 'annual';
    return 'free';
  }
}
