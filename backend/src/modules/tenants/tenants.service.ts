import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Família não encontrada');
    return tenant;
  }

  async update(id: string, data: any) {
    return this.prisma.tenant.update({ where: { id }, data });
  }

  async getDashboard(tenantId: string) {
    const [children, tasks, tenant] = await Promise.all([
      this.prisma.child.findMany({ where: { tenantId } }),
      this.prisma.task.findMany({ where: { tenantId, isActive: true } }),
      this.prisma.tenant.findUnique({ where: { id: tenantId } }),
    ]);

    const childrenWithData = await Promise.all(
      children.map(async (child) => {
        const period = await this.prisma.allowancePeriod.findFirst({
          where: { childId: child.id, status: 'open' },
        });
        const pendingTasks = await this.prisma.taskAssignment.count({
          where: { childId: child.id, status: 'pending' },
        });
        return { ...child, currentPeriod: period, pendingTasks };
      }),
    );

    return { tenant, children: childrenWithData, totalTasks: tasks.length };
  }
}
