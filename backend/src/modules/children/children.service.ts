import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ChildLoginDto } from './dto/child-login.dto';

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateChildDto) {
    const count = await this.prisma.child.count({ where: { tenantId } });
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    if (tenant.plan === 'free' && count >= 1) {
      throw new ForbiddenException('Plano gratuito permite apenas 1 filho. Faça upgrade!');
    }
    if (count >= 5) {
      throw new ForbiddenException('Limite máximo de 5 filhos atingido');
    }

    const pinHash = dto.pin ? await bcrypt.hash(dto.pin, 12) : null;

    return this.prisma.child.create({
      data: {
        tenantId,
        name: dto.name,
        nickname: dto.nickname,
        birthdate: new Date(dto.birthdate),
        avatarUrl: dto.avatarUrl,
        pinHash,
        allowanceAmount: dto.allowanceAmount || 0,
        allowanceFrequency: dto.allowanceFrequency || 'monthly',
        allowanceRule: dto.allowanceRule || 'proportional',
        thresholdPercent: dto.thresholdPercent || 50,
        allowanceDay: dto.allowanceDay || 5,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.child.findMany({
      where: { tenantId },
      include: { childBadges: { include: { badge: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const child = await this.prisma.child.findFirst({
      where: { id, tenantId },
      include: {
        childBadges: { include: { badge: true } },
        specialGoals: true,
      },
    });
    if (!child) throw new NotFoundException('Filho não encontrado');
    return child;
  }

  async update(tenantId: string, id: string, dto: UpdateChildDto) {
    await this.findOne(tenantId, id);

    const data: any = { ...dto };
    if (dto.pin) {
      data.pinHash = await bcrypt.hash(dto.pin, 12);
      delete data.pin;
    }
    if (dto.birthdate) data.birthdate = new Date(dto.birthdate);

    return this.prisma.child.update({ where: { id }, data });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.child.delete({ where: { id } });
  }

  async childLogin(tenantId: string, dto: ChildLoginDto) {
    const child = await this.prisma.child.findFirst({
      where: { tenantId, id: dto.childId },
    });
    if (!child) throw new NotFoundException('Criança não encontrada');
    if (!child.pinHash) throw new BadRequestException('PIN não configurado');

    const valid = await bcrypt.compare(dto.pin, child.pinHash);
    if (!valid) throw new ForbiddenException('PIN incorreto');

    return { child: this.sanitizeChild(child) };
  }

  async toggleVacationMode(tenantId: string, id: string, active: boolean, start?: Date, end?: Date) {
    await this.findOne(tenantId, id);
    return this.prisma.child.update({
      where: { id },
      data: {
        vacationMode: active,
        vacationStart: active ? start : null,
        vacationEnd: active ? end : null,
      },
    });
  }

  async applyPenalty(tenantId: string, childId: string, userId: string, dto: { type: 'points' | 'allowance'; amount: number; reason: string }) {
    const child = await this.findOne(tenantId, childId);

    if (dto.type === 'points') {
      await this.prisma.child.update({
        where: { id: childId },
        data: { totalPoints: { decrement: dto.amount } },
      });
      await this.prisma.walletTransaction.create({
        data: {
          childId,
          type: 'debit',
          amount: 0,
          pointsAmount: dto.amount,
          description: `Penalidade (pontos): ${dto.reason}`,
          createdBy: userId,
        },
      });
    } else if (dto.type === 'allowance') {
      await this.prisma.walletTransaction.create({
        data: {
          childId,
          type: 'debit',
          amount: dto.amount,
          description: `Penalidade (mesada): ${dto.reason}`,
          createdBy: userId,
        },
      });
    }

    return { success: true, type: dto.type, amount: dto.amount, reason: dto.reason };
  }

  private sanitizeChild(child: any) {
    const { pinHash, ...safe } = child;
    return safe;
  }
}
