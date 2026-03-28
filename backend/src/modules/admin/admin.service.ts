import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const [totalTenants, paidTenants, freeTenants, totalChildren] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { plan: { not: 'free' } } }),
      this.prisma.tenant.count({ where: { plan: 'free' } }),
      this.prisma.child.count(),
    ]);

    return {
      totalTenants,
      paidTenants,
      freeTenants,
      totalChildren,
      conversionRate: totalTenants > 0 ? ((paidTenants / totalTenants) * 100).toFixed(2) : 0,
    };
  }

  async getTenants(page = 1, limit = 20, plan?: string) {
    const skip = (page - 1) * limit;
    const where = plan ? { plan: plan as any } : {};

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        include: { users: { select: { name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    return { tenants, total, page, limit };
  }

  async suspendTenant(id: string) {
    return this.prisma.tenant.update({ where: { id }, data: { status: 'suspended' } });
  }
}
