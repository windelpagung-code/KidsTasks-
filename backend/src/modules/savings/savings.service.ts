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

  async getAccount(tenantId: string, childId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);
    const transactions = await this.prisma.savingsTransaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Wallet balance for display
    const credits = await this.prisma.walletTransaction.aggregate({
      where: { childId, type: 'credit' }, _sum: { amount: true },
    });
    const debits = await this.prisma.walletTransaction.aggregate({
      where: { childId, type: 'debit' }, _sum: { amount: true },
    });
    const walletBalance = Number(credits._sum.amount || 0) - Number(debits._sum.amount || 0);

    return { account, transactions, walletBalance };
  }

  async deposit(tenantId: string, childId: string, userId: string, amount: number, description: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');
    if (amount <= 0) throw new BadRequestException('Valor deve ser maior que zero');

    const credits = await this.prisma.walletTransaction.aggregate({
      where: { childId, type: 'credit' }, _sum: { amount: true },
    });
    const debits = await this.prisma.walletTransaction.aggregate({
      where: { childId, type: 'debit' }, _sum: { amount: true },
    });
    const walletBalance = Number(credits._sum.amount || 0) - Number(debits._sum.amount || 0);

    if (amount > walletBalance) throw new BadRequestException('Saldo insuficiente na carteira');

    const account = await this.getOrCreateAccount(childId);

    await this.prisma.walletTransaction.create({
      data: { childId, type: 'debit', amount, description: `Depósito na poupança: ${description}`, createdBy: userId },
    });
    await this.prisma.savingsAccount.update({
      where: { id: account.id },
      data: { balance: { increment: amount } },
    });
    await this.prisma.savingsTransaction.create({
      data: { accountId: account.id, type: 'deposit', amount, description },
    });

    return { success: true };
  }

  async withdraw(tenantId: string, childId: string, userId: string, amount: number, description: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');
    if (amount <= 0) throw new BadRequestException('Valor deve ser maior que zero');

    const account = await this.getOrCreateAccount(childId);
    if (amount > Number(account.balance)) throw new BadRequestException('Saldo insuficiente na poupança');

    await this.prisma.walletTransaction.create({
      data: { childId, type: 'credit', amount, description: `Retirada da poupança: ${description}`, createdBy: userId },
    });
    await this.prisma.savingsAccount.update({
      where: { id: account.id },
      data: { balance: { decrement: amount } },
    });
    await this.prisma.savingsTransaction.create({
      data: { accountId: account.id, type: 'withdraw', amount, description },
    });

    return { success: true };
  }

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

  async redeemGoal(tenantId: string, childId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);
    if (!account.goalName || !account.goalAmount) throw new BadRequestException('Nenhuma meta definida');
    const goalAmt = Number(account.goalAmount);
    if (Number(account.balance) < goalAmt) throw new BadRequestException('Saldo insuficiente para resgatar a meta');

    // Debit savings only — does NOT credit wallet (goal was "spent")
    await this.prisma.$transaction([
      this.prisma.savingsAccount.update({
        where: { id: account.id },
        data: {
          balance: { decrement: goalAmt },
          goalName: null,
          goalAmount: null,
        },
      }),
      this.prisma.savingsTransaction.create({
        data: {
          accountId: account.id,
          type: 'withdraw',
          amount: goalAmt,
          description: `Meta "${account.goalName}" concluída — resgate`,
        },
      }),
    ]);

    return { success: true };
  }

  async updateGoal(tenantId: string, childId: string, goalName: string, goalAmount: number) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const account = await this.getOrCreateAccount(childId);
    return this.prisma.savingsAccount.update({
      where: { id: account.id },
      data: { goalName: goalName || null, goalAmount: goalAmount || null },
    });
  }
}
