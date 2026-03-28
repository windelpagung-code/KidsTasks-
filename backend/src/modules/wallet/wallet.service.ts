import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(tenantId: string, childId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const credits = await this.prisma.walletTransaction.aggregate({
      where: { childId, type: 'credit' },
      _sum: { amount: true },
    });

    const debits = await this.prisma.walletTransaction.aggregate({
      where: { childId, type: 'debit' },
      _sum: { amount: true },
    });

    return {
      balance: Number(credits._sum.amount || 0) - Number(debits._sum.amount || 0),
      totalPoints: child.totalPoints,
      credits: Number(credits._sum.amount || 0),
      debits: Number(debits._sum.amount || 0),
    };
  }

  async getTransactions(tenantId: string, childId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    return this.prisma.walletTransaction.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addTransaction(tenantId: string, childId: string, userId: string, dto: { type: 'credit' | 'debit'; amount: number; description: string }) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');
    if (!dto.amount || dto.amount <= 0) throw new BadRequestException('Valor deve ser maior que zero');

    return this.prisma.walletTransaction.create({
      data: {
        childId,
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        createdBy: userId,
      },
    });
  }

  async updateTransaction(tenantId: string, childId: string, txId: string, dto: { type?: 'credit' | 'debit'; amount?: number; description?: string }) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const tx = await this.prisma.walletTransaction.findFirst({ where: { id: txId, childId } });
    if (!tx) throw new NotFoundException('Transação não encontrada');

    return this.prisma.walletTransaction.update({
      where: { id: txId },
      data: {
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async deleteTransaction(tenantId: string, childId: string, txId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const tx = await this.prisma.walletTransaction.findFirst({ where: { id: txId, childId } });
    if (!tx) throw new NotFoundException('Transação não encontrada');

    return this.prisma.walletTransaction.delete({ where: { id: txId } });
  }

  async markAllowancePaid(tenantId: string, childId: string, userId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const amount = Number(child.allowanceAmount);
    if (amount <= 0) throw new BadRequestException('Valor da mesada não configurado');

    return this.prisma.walletTransaction.create({
      data: {
        childId,
        type: 'credit',
        amount,
        description: 'Pagamento de mesada',
        createdBy: userId,
      },
    });
  }
}
