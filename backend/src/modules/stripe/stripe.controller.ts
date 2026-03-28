import { Controller, Post, Get, Body, Headers, Req, RawBodyRequest, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { Request } from 'express';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar sessão de checkout' })
  checkout(@Req() req, @Body() dto: CheckoutDto) {
    const successUrl = `${process.env.FRONTEND_URL}/dashboard/billing?payment=success`;
    const cancelUrl = `${process.env.FRONTEND_URL}/dashboard/billing`;
    return this.stripeService.createCheckoutSession(
      req.user.tenantId, req.user.id, dto.priceId, successUrl, cancelUrl,
    );
  }

  @Post('portal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Portal de gerenciamento da assinatura' })
  portal(@Req() req) {
    const returnUrl = `${process.env.FRONTEND_URL}/dashboard/billing`;
    return this.stripeService.createPortalSession(req.user.tenantId, returnUrl);
  }

  @Get('subscription')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Info da assinatura atual' })
  subscriptionInfo(@Req() req) {
    return this.stripeService.getSubscriptionInfo(req.user.tenantId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook do Stripe (uso interno)' })
  webhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    return this.stripeService.handleWebhook(req.rawBody, signature);
  }
}
