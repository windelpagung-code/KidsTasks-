import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async createItem(tenantId: string, dto: CreateStoreItemDto) {
    return this.prisma.storeItem.create({
      data: { tenantId, ...dto },
    });
  }

  async updateItem(tenantId: string, itemId: string, dto: UpdateStoreItemDto) {
    const item = await this.prisma.storeItem.findFirst({ where: { id: itemId, tenantId } });
    if (!item) throw new NotFoundException('Item não encontrado');
    return this.prisma.storeItem.update({ where: { id: itemId }, data: dto });
  }

  async getItems(tenantId: string) {
    return this.prisma.storeItem.findMany({
      where: { tenantId, isActive: true },
      orderBy: { pointsCost: 'asc' },
    });
  }

  async deleteItem(tenantId: string, itemId: string) {
    const item = await this.prisma.storeItem.findFirst({ where: { id: itemId, tenantId } });
    if (!item) throw new NotFoundException('Item não encontrado');
    return this.prisma.storeItem.delete({ where: { id: itemId } });
  }

  async requestRedemption(tenantId: string, childId: string, itemId: string) {
    const child = await this.prisma.child.findFirst({ where: { id: childId, tenantId } });
    if (!child) throw new NotFoundException('Filho não encontrado');

    const item = await this.prisma.storeItem.findFirst({ where: { id: itemId, tenantId, isActive: true } });
    if (!item) throw new NotFoundException('Item não encontrado');

    if (item.stockLimit && item.stockUsed >= item.stockLimit) {
      throw new ForbiddenException('Item fora de estoque');
    }

    if (child.totalPoints < item.pointsCost) {
      throw new ForbiddenException('Pontos insuficientes');
    }

    return this.prisma.storeRedemption.create({
      data: { childId, itemId, status: 'pending' },
    });
  }

  async resolveRedemption(tenantId: string, userId: string, redemptionId: string, approved: boolean) {
    const redemption = await this.prisma.storeRedemption.findFirst({
      where: { id: redemptionId, item: { tenantId } },
      include: { item: true, child: true },
    });
    if (!redemption) throw new NotFoundException('Solicitação não encontrada');

    if (approved) {
      await this.prisma.child.update({
        where: { id: redemption.childId },
        data: { totalPoints: { decrement: redemption.item.pointsCost } },
      });
      await this.prisma.storeItem.update({
        where: { id: redemption.itemId },
        data: { stockUsed: { increment: 1 } },
      });
      await this.prisma.walletTransaction.create({
        data: {
          childId: redemption.childId,
          type: 'debit',
          amount: 0,
          pointsAmount: redemption.item.pointsCost,
          description: `Resgate: ${redemption.item.name}`,
          referenceId: redemptionId,
          createdBy: userId,
        },
      });
    }

    return this.prisma.storeRedemption.update({
      where: { id: redemptionId },
      data: {
        status: approved ? 'approved' : 'rejected',
        resolvedAt: new Date(),
        resolvedBy: userId,
      },
    });
  }

  async getRedemptions(tenantId: string, childId?: string) {
    return this.prisma.storeRedemption.findMany({
      where: {
        item: { tenantId },
        ...(childId ? { childId } : {}),
      },
      include: { item: true, child: true },
      orderBy: { requestedAt: 'desc' },
    });
  }
}
