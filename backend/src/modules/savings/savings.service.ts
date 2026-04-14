import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateAccount(childId: string) {
    const existing = await this.prisma.savingsAccount.findUnique({ where: { childId } });
    if (existing) return existing;
    return this.prisma.savingsAccount.create({ data: { childId, balance: 0 } });
  }

  // ── Conta geral ─────────────────────────────────────────────
  async getAccount(tenantId: string, childId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);

    const [transactions, goals] = await Promise.all([
      this.prisma.savingsTransaction.findMany({
        where: { accountId: account.id },
        include: { goal: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.prisma.savingsGoal.findMany({
        where: { accountId: account.id },
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    // Wallet balance para exibir no depósito
    const credits = await this.prisma.walletTransaction.aggregate({
      where: { childId, type: 'credit' }, _sum: { amount: true },
    });
    const debits = await this.prisma.walletTransaction.aggregate({
      where: { childId, type: 'debit' }, _sum: { amount: true },
    });
    const walletBalance = Number(credits._sum.amount || 0) - Number(debits._sum.amount || 0);

    return { account, transactions, goals, walletBalance };
  }

  // ── Depósito / Retirada (saldo geral) ────────────────────────
  async deposit(tenantId: string, childId: string, userId: string, amount: number, description: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');
    if (amount <= 0) throw new BadRequestException('Valor deve ser maior que zero');

    const credits = await this.prisma.walletTransaction.aggregate({ where: { childId, type: 'credit' }, _sum: { amount: true } });
    const debits  = await this.prisma.walletTransaction.aggregate({ where: { childId, type: 'debit' },  _sum: { amount: true } });
    const walletBalance = Number(credits._sum.amount || 0) - Number(debits._sum.amount || 0);
    if (amount > walletBalance) throw new BadRequestException('Saldo insuficiente na carteira');

    const account = await this.getOrCreateAccount(childId);

    await this.prisma.$transaction([
      this.prisma.walletTransaction.create({
        data: { childId, type: 'debit', amount, description: `Depósito na poupança: ${description}`, createdBy: userId },
      }),
      this.prisma.savingsAccount.update({ where: { id: account.id }, data: { balance: { increment: amount } } }),
      this.prisma.savingsTransaction.create({
        data: { accountId: account.id, type: 'deposit', amount, description },
      }),
    ]);

    return { success: true };
  }

  async withdraw(tenantId: string, childId: string, userId: string, amount: number, description: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');
    if (amount <= 0) throw new BadRequestException('Valor deve ser maior que zero');

    const account = await this.getOrCreateAccount(childId);
    if (amount > Number(account.balance)) throw new BadRequestException('Saldo insuficiente na poupança');

    await this.prisma.$transaction([
      this.prisma.walletTransaction.create({
        data: { childId, type: 'credit', amount, description: `Retirada da poupança: ${description}`, createdBy: userId },
      }),
      this.prisma.savingsAccount.update({ where: { id: account.id }, data: { balance: { decrement: amount } } }),
      this.prisma.savingsTransaction.create({
        data: { accountId: account.id, type: 'withdraw', amount, description },
      }),
    ]);

    return { success: true };
  }

  // ── Metas ────────────────────────────────────────────────────
  async createGoal(tenantId: string, childId: string, name: string, targetAmount: number, icon?: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');
    if (targetAmount <= 0) throw new BadRequestException('Valor da meta deve ser maior que zero');

    const account = await this.getOrCreateAccount(childId);
    return this.prisma.savingsGoal.create({
      data: { accountId: account.id, name, targetAmount, icon: icon || null },
    });
  }

  async updateGoal(tenantId: string, childId: string, goalId: string, name: string, targetAmount: number, icon?: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);
    const goal = await this.prisma.savingsGoal.findFirst({ where: { id: goalId, accountId: account.id, status: 'active' } });
    if (!goal) throw new NotFoundException('Meta não encontrada');
    if (targetAmount < Number(goal.savedAmount)) throw new BadRequestException('Valor alvo não pode ser menor que o já guardado');

    return this.prisma.savingsGoal.update({
      where: { id: goalId },
      data: { name, targetAmount, icon: icon || null },
    });
  }

  async deleteGoal(tenantId: string, childId: string, goalId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);
    const goal = await this.prisma.savingsGoal.findFirst({ where: { id: goalId, accountId: account.id, status: 'active' } });
    if (!goal) throw new NotFoundException('Meta não encontrada');

    const savedAmt = Number(goal.savedAmount);

    // Devolve o saldo guardado para o saldo geral
    await this.prisma.$transaction([
      ...(savedAmt > 0 ? [
        this.prisma.savingsAccount.update({ where: { id: account.id }, data: { balance: { increment: savedAmt } } }),
        this.prisma.savingsTransaction.create({
          data: { accountId: account.id, goalId, type: 'goal_deleted', amount: savedAmt, description: `Meta "${goal.name}" excluída — saldo devolvido` },
        }),
      ] : []),
      this.prisma.savingsGoal.delete({ where: { id: goalId } }),
    ]);

    return { success: true };
  }

  // ── Alocar saldo geral → meta ────────────────────────────────
  async allocateToGoal(tenantId: string, childId: string, goalId: string, amount: number) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');
    if (amount <= 0) throw new BadRequestException('Valor deve ser maior que zero');

    const account = await this.getOrCreateAccount(childId);
    if (amount > Number(account.balance)) throw new BadRequestException('Saldo geral insuficiente');

    const goal = await this.prisma.savingsGoal.findFirst({ where: { id: goalId, accountId: account.id, status: 'active' } });
    if (!goal) throw new NotFoundException('Meta não encontrada');

    const maxAllocatable = Number(goal.targetAmount) - Number(goal.savedAmount);
    if (amount > maxAllocatable) throw new BadRequestException(`A meta só precisa de mais R$ ${maxAllocatable.toFixed(2)}`);

    await this.prisma.$transaction([
      this.prisma.savingsAccount.update({ where: { id: account.id }, data: { balance: { decrement: amount } } }),
      this.prisma.savingsGoal.update({ where: { id: goalId }, data: { savedAmount: { increment: amount } } }),
      this.prisma.savingsTransaction.create({
        data: { accountId: account.id, goalId, type: 'allocation', amount, description: `Alocado para meta "${goal.name}"` },
      }),
    ]);

    return { success: true };
  }

  // ── Resgatar meta (concluída) ────────────────────────────────
  async redeemGoal(tenantId: string, childId: string, goalId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);
    const goal = await this.prisma.savingsGoal.findFirst({ where: { id: goalId, accountId: account.id, status: 'active' } });
    if (!goal) throw new NotFoundException('Meta não encontrada');

    const savedAmt = Number(goal.savedAmount);
    if (savedAmt < Number(goal.targetAmount)) {
      throw new BadRequestException(`Meta ainda não atingida. Guardados R$ ${savedAmt.toFixed(2)} de R$ ${Number(goal.targetAmount).toFixed(2)}`);
    }

    await this.prisma.$transaction([
      this.prisma.savingsGoal.update({
        where: { id: goalId },
        data: { status: 'completed', completedAt: new Date() },
      }),
      this.prisma.savingsTransaction.create({
        data: { accountId: account.id, goalId, type: 'goal_completed', amount: savedAmt, description: `Meta "${goal.name}" conquistada! 🎉` },
      }),
    ]);

    return { success: true };
  }

  // ── Editar / excluir transação do saldo geral ────────────────
  async updateTransaction(tenantId: string, childId: string, txId: string, description: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);
    const tx = await this.prisma.savingsTransaction.findFirst({ where: { id: txId, accountId: account.id } });
    if (!tx) throw new NotFoundException('Lançamento não encontrado');

    return this.prisma.savingsTransaction.update({ where: { id: txId }, data: { description } });
  }

  async deleteTransaction(tenantId: string, childId: string, txId: string, userId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);
    const tx = await this.prisma.savingsTransaction.findFirst({ where: { id: txId, accountId: account.id } });
    if (!tx) throw new NotFoundException('Lançamento não encontrado');

    // Só permite excluir depósitos e retiradas simples (não alocações nem conclusões)
    if (['allocation', 'goal_completed', 'goal_deleted'].includes(tx.type)) {
      throw new BadRequestException('Este tipo de lançamento não pode ser excluído diretamente');
    }

    const newBalance = Number(account.balance) + (tx.type === 'deposit' ? -Number(tx.amount) : Number(tx.amount));
    if (newBalance < 0) throw new BadRequestException('Não é possível excluir: o saldo ficaria negativo');

    const reversalType = tx.type === 'deposit' ? 'credit' : 'debit';
    const reversalDesc = tx.type === 'deposit'
      ? `Estorno de depósito na poupança: ${tx.description}`
      : `Estorno de retirada da poupança: ${tx.description}`;

    await this.prisma.$transaction([
      this.prisma.savingsTransaction.delete({ where: { id: txId } }),
      this.prisma.savingsAccount.update({ where: { id: account.id }, data: { balance: newBalance } }),
      this.prisma.walletTransaction.create({
        data: { childId, type: reversalType, amount: tx.amount, description: reversalDesc, createdBy: userId },
      }),
    ]);

    return { success: true };
  }

  // ── Compatibilidade retroativa (antigo endpoint) ─────────────
  async redeemGoalLegacy(tenantId: string, childId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');
    throw new BadRequestException('Use o novo endpoint POST /savings/:childId/goals/:goalId/redeem');
  }

  async updateGoalLegacy() {
    throw new BadRequestException('Use o novo endpoint POST /savings/:childId/goals');
  }
}
