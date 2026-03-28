import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const LEVELS = [
  { level: 1, title: 'Aprendiz', minPoints: 0, maxPoints: 199 },
  { level: 2, title: 'Explorador', minPoints: 200, maxPoints: 499 },
  { level: 3, title: 'Aventureiro', minPoints: 500, maxPoints: 999 },
  { level: 4, title: 'Campeão', minPoints: 1000, maxPoints: 2499 },
  { level: 5, title: 'Lenda', minPoints: 2500, maxPoints: Infinity },
];

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  getLevelInfo(totalPoints: number) {
    return LEVELS.find(
      (l) => totalPoints >= l.minPoints && totalPoints <= l.maxPoints,
    ) || LEVELS[0];
  }

  async checkAndAwardBadges(childId: string) {
    const child = await this.prisma.child.findUnique({
      where: { id: childId },
      include: { childBadges: true, taskAssignments: { include: { task: true } } },
    });

    const badges = await this.prisma.badge.findMany();
    const earnedBadgeIds = child.childBadges.map((b) => b.badgeId);
    const newBadges = [];

    for (const badge of badges) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      let earned = false;
      const completedTasks = child.taskAssignments.filter(
        (a) => a.status === 'done' || a.status === 'approved',
      );

      switch (badge.conditionType) {
        case 'first_task':
          earned = completedTasks.length >= 1;
          break;
        case 'total_tasks':
          earned = completedTasks.length >= badge.conditionValue;
          break;
        case 'total_points':
          earned = child.totalPoints >= badge.conditionValue;
          break;
        case 'category_tasks':
          const categoryTasks = completedTasks.filter(
            (a) => a.task.category === 'estudo',
          );
          earned = categoryTasks.length >= badge.conditionValue;
          break;
      }

      if (earned) {
        await this.prisma.childBadge.create({
          data: { childId, badgeId: badge.id },
        });
        newBadges.push(badge);
      }
    }

    const newLevel = this.getLevelInfo(child.totalPoints);
    if (newLevel.level !== child.level) {
      await this.prisma.child.update({
        where: { id: childId },
        data: { level: newLevel.level },
      });
    }

    return { newBadges, levelInfo: newLevel };
  }

  async getRanking(tenantId: string, period: 'weekly' | 'monthly' = 'weekly') {
    const now = new Date();
    const start = new Date(now);
    if (period === 'weekly') {
      start.setDate(now.getDate() - 7);
    } else {
      start.setMonth(now.getMonth() - 1);
    }

    const children = await this.prisma.child.findMany({
      where: { tenantId },
    });

    const ranking = await Promise.all(
      children.map(async (child) => {
        const earned = await this.prisma.taskAssignment.aggregate({
          where: {
            childId: child.id,
            completedAt: { gte: start },
            status: { in: ['done', 'approved'] },
          },
          _sum: { pointsEarned: true },
        });

        return {
          child: { id: child.id, name: child.name, nickname: child.nickname, avatarUrl: child.avatarUrl, level: child.level },
          periodPoints: earned._sum.pointsEarned || 0,
          totalPoints: child.totalPoints,
        };
      }),
    );

    return ranking.sort((a, b) => b.periodPoints - a.periodPoints);
  }

  async getChildDashboard(tenantId: string, childId: string) {
    const child = await this.prisma.child.findFirst({
      where: { id: childId, tenantId },
      include: {
        childBadges: { include: { badge: true } },
        taskAssignments: {
          where: { status: 'pending' },
          include: { task: true },
          take: 10,
        },
      },
    });

    if (!child) return null;

    const levelInfo = this.getLevelInfo(child.totalPoints);
    const currentPeriod = await this.prisma.allowancePeriod.findFirst({
      where: { childId, status: 'open' },
    });

    const walletBalance = await this.prisma.walletTransaction.aggregate({
      where: { childId },
      _sum: { amount: true },
    });

    return {
      child: { ...child, pinHash: undefined },
      levelInfo,
      currentPeriod,
      walletBalance: walletBalance._sum.amount || 0,
      pendingTasks: child.taskAssignments,
      badges: child.childBadges,
    };
  }
}
