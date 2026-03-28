import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.tenantId) return true;

    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (!tenant) return true;

    if (tenant.status === 'suspended') {
      throw new ForbiddenException({
        statusCode: 403,
        error: 'subscription_suspended',
        message: 'Assinatura suspensa por falta de pagamento. Acesse o painel de planos para regularizar.',
      });
    }

    return true;
  }
}
