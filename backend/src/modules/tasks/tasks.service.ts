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

  /** Retorna meia-noite UTC do dia especificado (ou hoje se não informado) */
  private utcDayStart(date?: Date): Date {
    const d = date ?? new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
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

  private async ensureNextCycle(taskId: string, childId: string, originalPeriodEnd: Date) {
    const now = new Date();
    const todayStart = this.utcDayStart();

    const alreadyToday = await this.prisma.taskAssignment.findFirst({
      where: { taskId, childId, status: 'pending', periodStart: { gte: todayStart } },
    });
    if (alreadyToday) return;

    const newPeriodEnd =
      originalPeriodEnd > now
        ? originalPeriodEnd
        : new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth() + 1, todayStart.getUTCDate()));

    await this.prisma.taskAssignment.create({
      data: { taskId, childId, periodStart: todayStart, periodEnd: newPeriodEnd, status: 'pending' },
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
    const now = new Date();
    const todayStart = this.utcDayStart();
    const tomorrowStart = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), todayStart.getUTCDate() + 1));

    // Verifica se criança existe e não está em férias
    const child = await this.prisma.child.findFirst({ where: { id: childId, vacationMode: false } });
    if (!child) return [];

    // Busca todas as tarefas ativas atribuídas a esta criança
    const tasks = await this.prisma.task.findMany({
      where: { tenantId, isActive: true, assignments: { some: { childId } } },
      orderBy: { sortOrder: 'asc' },
    });
    if (tasks.length === 0) return [];

    // Busca todos os assignments de uma vez (evita N+1)
    const allAssignments = await this.prisma.taskAssignment.findMany({
      where: { taskId: { in: tasks.map((t) => t.id) }, childId },
      include: { task: true, child: true },
      orderBy: { createdAt: 'desc' },
    });

    const result: (typeof allAssignments)[number][] = [];

    for (const task of tasks) {
      const taskAssignments = allAssignments.filter((a) => a.taskId === task.id);

      if (task.recurrenceType === 'one_time') {
        // Tarefas únicas: retorna o assignment mais recente
        if (taskAssignments.length > 0) result.push(taskAssignments[0]);
        continue;
      }

      // Tarefas recorrentes: procura um registro de HOJE
      // "hoje" = done/approved com completedAt hoje OU pending com periodStart hoje
      const todayRecord = taskAssignments.find((a) => {
        if (a.status === 'done' || a.status === 'approved') {
          return a.completedAt && a.completedAt >= todayStart && a.completedAt < tomorrowStart;
        }
        return a.status === 'pending' && a.periodStart >= todayStart;
      });

      if (todayRecord) {
        result.push(todayRecord);
      } else {
        // Nenhum registro de hoje → cria novo ciclo pendente
        const last = taskAssignments[0];
        const periodEnd =
          last && last.periodEnd > now
            ? last.periodEnd
            : new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth() + 1, todayStart.getUTCDate()));

        const newAssignment = await this.prisma.taskAssignment.create({
          data: { taskId: task.id, childId, periodStart: todayStart, periodEnd, status: 'pending' },
          include: { task: true, child: true },
        });
        result.push(newAssignment);
      }
    }

    return result;
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

  async getHistory(tenantId: string, date?: string, childId?: string) {
    let start: Date;
    let end: Date;
    if (date) {
      // Parseia "YYYY-MM-DD" explicitamente em UTC — evita problemas de timezone no servidor
      const [y, m, d] = date.split('-').map(Number);
      start = new Date(Date.UTC(y, m - 1, d));
      end = new Date(Date.UTC(y, m - 1, d + 1));
    } else {
      start = this.utcDayStart();
      end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 1));
    }

    return this.prisma.taskAssignment.findMany({
      where: {
        task: { tenantId, isActive: true },
        completedAt: { gte: start, lt: end },
        status: { in: ['done', 'approved'] },
        ...(childId ? { childId } : {}),
      },
      include: { task: true, child: true },
      orderBy: [{ child: { name: 'asc' } }, { completedAt: 'asc' }],
    });
  }
}
