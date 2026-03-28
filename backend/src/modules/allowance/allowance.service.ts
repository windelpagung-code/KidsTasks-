import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AllowanceService {
  constructor(private prisma: PrismaService) {}

  async createPeriod(childId: string, tenantId: string, start: Date, end: Date, targetPoints: number) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    return this.prisma.allowancePeriod.create({
      data: {
        childId,
        periodStart: start,
        periodEnd: end,
        targetPoints,
        status: 'open',
        amountDue: child.allowanceAmount,
      },
    });
  }

  async calculateAndClose(periodId: string) {
    const period = await this.prisma.allowancePeriod.findUnique({
      where: { id: periodId },
      include: { child: true },
    });
    if (!period) throw new NotFoundException('Período não encontrado');

    const earnedPoints = await this.prisma.taskAssignment.aggregate({
      where: {
        childId: period.childId,
        completedAt: { gte: period.periodStart, lte: period.periodEnd },
        status: { in: ['done', 'approved'] },
      },
      _sum: { pointsEarned: true },
    });

    const earned = earnedPoints._sum.pointsEarned || 0;
    const percent = period.targetPoints > 0 ? (earned / period.targetPoints) * 100 : 0;

    let amountDue = new Decimal(0);
    const child = period.child;

    if (child.allowanceRule === 'proportional') {
      amountDue = new Decimal(child.allowanceAmount).mul(Math.min(percent, 100)).div(100);
    } else if (child.allowanceRule === 'threshold') {
      amountDue = percent >= child.thresholdPercent
        ? new Decimal(child.allowanceAmount)
        : new Decimal(0);
    }

    return this.prisma.allowancePeriod.update({
      where: { id: periodId },
      data: {
        earnedPoints: earned,
        percentAchieved: Math.min(percent, 100),
        amountDue,
        status: 'closed',
      },
    });
  }

  async confirmPayment(periodId: string, userId: string, amountPaid: number) {
    const period = await this.prisma.allowancePeriod.findUnique({
      where: { id: periodId },
    });
    if (!period) throw new NotFoundException('Período não encontrado');

    const updated = await this.prisma.allowancePeriod.update({
      where: { id: periodId },
      data: {
        amountPaid: amountPaid,
        status: 'paid',
        paidAt: new Date(),
      },
    });

    await this.prisma.walletTransaction.create({
      data: {
        childId: period.childId,
        type: 'credit',
        amount: amountPaid,
        pointsAmount: 0,
        description: `Mesada do período ${period.periodStart.toLocaleDateString('pt-BR')} a ${period.periodEnd.toLocaleDateString('pt-BR')}`,
        referenceId: periodId,
        createdBy: userId,
      },
    });

    return updated;
  }

  async getPeriods(tenantId: string, childId?: string) {
    return this.prisma.allowancePeriod.findMany({
      where: {
        child: { tenantId },
        ...(childId ? { childId } : {}),
      },
      include: { child: true },
      orderBy: { periodStart: 'desc' },
    });
  }

  async getCurrentPeriod(tenantId: string, childId: string) {
    return this.prisma.allowancePeriod.findFirst({
      where: {
        childId,
        child: { tenantId },
        status: 'open',
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
