import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { Difficulty, RecurrenceType } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private getPointMultiplier(difficulty: Difficulty): number {
    const multipliers = { easy: 1, medium: 1.5, hard: 2 };
    return multipliers[difficulty] || 1;
  }

  async create(tenantId: string, userId: string, dto: CreateTaskDto) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    if (tenant.plan === 'free') {
      const activeCount = await this.prisma.task.count({
        where: { tenantId, isActive: true },
      });
      if (activeCount >= 5) {
        throw new ForbiddenException('Plano gratuito permite apenas 5 tarefas. Faça upgrade!');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        icon: dto.icon,
        category: dto.category,
        difficulty: dto.difficulty || 'easy',
        basePoints: dto.basePoints || 10,
        recurrenceType: dto.recurrenceType,
        recurrenceDays: dto.recurrenceDays ? JSON.stringify(dto.recurrenceDays) : null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        createdBy: userId,
      },
    });

    if (dto.childIds?.length) {
      await this.createAssignments(task.id, dto.childIds, dto.periodStart, dto.periodEnd);
    }

    return task;
  }

  async createAssignments(taskId: string, childIds: string[], periodStart?: string, periodEnd?: string) {
    const now = new Date();
    const start = periodStart ? new Date(periodStart) : now;
    const end = periodEnd ? new Date(periodEnd) : new Date(now.setMonth(now.getMonth() + 1));

    await this.prisma.taskAssignment.createMany({
      data: childIds.map((childId) => ({
        taskId,
        childId,
        periodStart: start,
        periodEnd: end,
        status: 'pending',
      })),
      skipDuplicates: true,
    });
  }

  async findAll(tenantId: string, childId?: string) {
    return this.prisma.task.findMany({
      where: {
        tenantId,
        ...(childId ? { isActive: true, assignments: { some: { childId } } } : {}),
      },
      include: {
        assignments: childId
          ? { where: { childId }, include: { child: true } }
          : { include: { child: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(tenantId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId },
      include: { assignments: { include: { child: true } } },
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async update(tenantId: string, id: string, dto: UpdateTaskDto) {
    await this.findOne(tenantId, id);
    const { recurrenceDays, dueDate, childIds, periodStart, periodEnd, ...rest } = dto;
    await this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        recurrenceDays: recurrenceDays ? JSON.stringify(recurrenceDays) : undefined,
      },
    });
    if (childIds?.length) {
      // Limpa duplicatas existentes para esta tarefa (mantém o de maior progresso)
      const statusPriority: Record<string, number> = { approved: 3, done: 2, pending: 1, not_done: 0 };
      const all = await this.prisma.taskAssignment.findMany({
        where: { taskId: id },
        orderBy: { createdAt: 'desc' },
      });
      const bestByChild = new Map<string, string>(); // childId -> assignmentId a manter
      for (const a of all) {
        const existing = bestByChild.get(a.childId);
        if (!existing) {
          bestByChild.set(a.childId, a.id);
        } else {
          const existingAssignment = all.find((x) => x.id === existing)!;
          const existingPriority = statusPriority[existingAssignment.status] ?? 0;
          const currentPriority = statusPriority[a.status] ?? 0;
          if (currentPriority > existingPriority) {
            bestByChild.set(a.childId, a.id);
          }
        }
      }
      const toDelete = all.map((a) => a.id).filter((aid) => !Array.from(bestByChild.values()).includes(aid));
      if (toDelete.length) {
        await this.prisma.taskAssignment.deleteMany({ where: { id: { in: toDelete } } });
      }

      // Cria assignment apenas para filhos novos
      const assignedChildIds = new Set(bestByChild.keys());
      const newChildIds = childIds.filter((cid) => !assignedChildIds.has(cid));
      if (newChildIds.length) {
        await this.createAssignments(id, newChildIds, periodStart, periodEnd);
      }
    }
    return this.findOne(tenantId, id);
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.task.delete({ where: { id } });
  }

  async completeTask(tenantId: string, userId: string, dto: CompleteTaskDto) {
    const assignment = await this.prisma.taskAssignment.findFirst({
      where: {
        id: dto.assignmentId,
        task: { tenantId },
      },
      include: { task: true, child: true },
    });

    if (!assignment) throw new NotFoundException('Tarefa não encontrada');
    if (assignment.status === 'done' || assignment.status === 'approved') {
      throw new ForbiddenException('Tarefa já concluída');
    }

    const multiplier = this.getPointMultiplier(assignment.task.difficulty);
    const pointsEarned = Math.floor(assignment.task.basePoints * multiplier);

    const updated = await this.prisma.taskAssignment.update({
      where: { id: dto.assignmentId },
      data: {
        status: 'done',
        completedAt: dto.completedAt ? new Date(dto.completedAt) : new Date(),
        pointsEarned,
      },
    });

    await this.prisma.child.update({
      where: { id: assignment.childId },
      data: { totalPoints: { increment: pointsEarned } },
    });

    // Para tarefas recorrentes, cria próximo ciclo automaticamente
    if (assignment.task.recurrenceType !== 'one_time') {
      await this.ensureNextCycle(assignment.taskId, assignment.childId, assignment.periodEnd);
    }

    return { assignment: updated, pointsEarned };
  }

  private async ensureNextCycle(taskId: string, childId: string, periodEnd: Date) {
    const now = new Date();
    if (periodEnd <= now) return; // período expirado, não cria novo ciclo

    const alreadyPending = await this.prisma.taskAssignment.findFirst({
      where: { taskId, childId, status: 'pending' },
    });
    if (alreadyPending) return;

    const nextStart = new Date(now);
    nextStart.setHours(0, 0, 0, 0); // início de hoje
    await this.prisma.taskAssignment.create({
      data: { taskId, childId, periodStart: nextStart, periodEnd, status: 'pending' },
    });
  }

  async approveTask(tenantId: string, userId: string, assignmentId: string) {
    const assignment = await this.prisma.taskAssignment.findFirst({
      where: { id: assignmentId, task: { tenantId } },
      include: { task: true },
    });
    if (!assignment) throw new NotFoundException('Tarefa não encontrada');

    const result = await this.prisma.taskAssignment.update({
      where: { id: assignmentId },
      data: { status: 'approved', approvedBy: userId },
    });

    if (assignment.task.recurrenceType !== 'one_time') {
      await this.ensureNextCycle(assignment.taskId, assignment.childId, assignment.periodEnd);
    }

    return result;
  }

  async getChildTasks(tenantId: string, childId: string) {
    const assignments = await this.prisma.taskAssignment.findMany({
      where: {
        childId,
        task: { tenantId, isActive: true },
        child: { vacationMode: false },
      },
      include: { task: true, child: true },
      orderBy: [{ task: { sortOrder: 'asc' } }, { createdAt: 'desc' }],
    });

    // Para cada tarefa, mantém apenas o assignment mais recente
    const seen = new Set<string>();
    const latest = assignments.filter((a) => {
      if (seen.has(a.taskId)) return false;
      seen.add(a.taskId);
      return true;
    });

    // Fix retroativo: tarefas recorrentes presas em done/approved ganham novo ciclo pendente
    await Promise.all(
      latest
        .filter(
          (a) =>
            a.task.recurrenceType !== 'one_time' &&
            (a.status === 'done' || a.status === 'approved'),
        )
        .map((a) => this.ensureNextCycle(a.taskId, a.childId, a.periodEnd)),
    );

    // Rebusca para retornar os assignments atualizados (inclui os novos pendentes)
    const refreshed = await this.prisma.taskAssignment.findMany({
      where: {
        childId,
        task: { tenantId, isActive: true },
        child: { vacationMode: false },
      },
      include: { task: true, child: true },
      orderBy: [{ task: { sortOrder: 'asc' } }, { createdAt: 'desc' }],
    });

    const seen2 = new Set<string>();
    return refreshed.filter((a) => {
      if (seen2.has(a.taskId)) return false;
      seen2.add(a.taskId);
      return true;
    });
  }

  async reorder(tenantId: string, ids: string[]) {
    await Promise.all(
      ids.map((id, index) =>
        this.prisma.task.updateMany({
          where: { id, tenantId },
          data: { sortOrder: index },
        }),
      ),
    );
    return { reordered: ids.length };
  }

  async bulkComplete(tenantId: string, userId: string, assignmentIds: string[], done: boolean) {
    const assignments = await this.prisma.taskAssignment.findMany({
      where: { id: { in: assignmentIds }, task: { tenantId } },
      include: { task: true },
    });

    for (const a of assignments) {
      if (done) {
        const multiplier = this.getPointMultiplier(a.task.difficulty);
        const pointsEarned = Math.floor(a.task.basePoints * multiplier);
        await this.prisma.taskAssignment.update({
          where: { id: a.id },
          data: { status: 'done', completedAt: new Date(), pointsEarned },
        });
        await this.prisma.child.update({
          where: { id: a.childId },
          data: { totalPoints: { increment: pointsEarned } },
        });
      } else {
        await this.prisma.taskAssignment.update({
          where: { id: a.id },
          data: { status: 'not_done' },
        });
      }
    }

    return { updated: assignments.length };
  }
}
