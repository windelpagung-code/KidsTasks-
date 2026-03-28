import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.badge.findMany();
  }

  async getChildBadges(tenantId: string, childId: string) {
    return this.prisma.childBadge.findMany({
      where: { childId, child: { tenantId } },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async seedDefaultBadges() {
    const defaults = [
      { name: 'Primeira Tarefa', description: 'Completou a primeira tarefa do sistema', icon: '⭐', conditionType: 'first_task', conditionValue: 1 },
      { name: 'Semana Perfeita', description: '100% das tarefas de uma semana concluídas', icon: '🏆', conditionType: 'total_tasks', conditionValue: 7 },
      { name: 'Estudioso', description: '30 tarefas da categoria estudo concluídas', icon: '📚', conditionType: 'category_tasks', conditionValue: 30 },
      { name: 'Super Organizado', description: '50 tarefas de organização concluídas', icon: '🧹', conditionType: 'total_tasks', conditionValue: 50 },
      { name: 'Poupador', description: 'Acumulou pontos suficientes para R$50', icon: '🐷', conditionType: 'total_points', conditionValue: 500 },
      { name: 'Lenda', description: 'Atingiu o nível máximo com 2500+ pontos', icon: '👑', conditionType: 'total_points', conditionValue: 2500 },
    ];

    for (const badge of defaults) {
      await this.prisma.badge.upsert({
        where: { id: badge.name },
        update: {},
        create: badge,
      });
    }
  }
}
