import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async getTeamMembers(tenantId: string) {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });
    return users.map(({ passwordHash, ...safe }) => safe);
  }

  async inviteCoResponsible(tenantId: string, rawEmail: string, role: string, name?: string) {
    const email = rawEmail.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.tenantId === tenantId) throw new BadRequestException('Usuário já faz parte desta família');
      throw new BadRequestException('Este e-mail já está cadastrado em outra família');
    }

    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        name: name?.trim() || email.split('@')[0],
        email,
        passwordHash,
        role: (['editor', 'viewer'].includes(role) ? role : 'editor') as any,
      },
    });

    const { passwordHash: _, ...safe } = user;
    return { user: safe, tempPassword, message: 'Responsável adicionado. Compartilhe as credenciais de acesso.' };
  }

  async removeTeamMember(tenantId: string, userId: string, requesterId: string) {
    if (userId === requesterId) throw new BadRequestException('Você não pode remover a si mesmo');
    const user = await this.prisma.user.findFirst({ where: { id: userId, tenantId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (user.role === 'admin') throw new BadRequestException('Não é possível remover o administrador principal');
    await this.prisma.user.delete({ where: { id: userId } });
    return { success: true };
  }
}
