import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const tenant = await this.prisma.tenant.create({
      data: { name: dto.familyName, plan: 'free', status: 'active' },
    });
    const user = await this.prisma.user.create({
      data: { tenantId: tenant.id, name: dto.name, email, passwordHash, role: 'admin' },
    });

    const tokens = await this.generateTokens(user.id, user.email, tenant.id, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: { tenant: true },
    });

    if (!user || !user.passwordHash) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const tokens = await this.generateTokens(user.id, user.email, user.tenantId, user.role);
    return { user: this.sanitizeUser(user), tenant: user.tenant, ...tokens };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) throw new NotFoundException('Usuário não encontrado');

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Senha atual incorreta');
    if (newPassword.length < 6) throw new BadRequestException('A nova senha deve ter pelo menos 6 caracteres');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    return { success: true };
  }

  async refreshToken(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
    await this.prisma.refreshToken.delete({ where: { token } });
    return this.generateTokens(stored.user.id, stored.user.email, stored.user.tenantId, stored.user.role);
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    // Always return success to avoid email enumeration
    if (!user) return { message: 'Se o e-mail estiver cadastrado, você receberá as instruções.' };

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiresAt: expiresAt },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    // In production, send email here. For now, log to console.
    console.log(`\n🔑 Reset password link for ${email}:\n${resetUrl}\n`);

    return { message: 'Se o e-mail estiver cadastrado, você receberá as instruções.', _devLink: resetUrl };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { resetToken: token } });
    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException('Link inválido ou expirado');
    }
    if (newPassword.length < 6) throw new BadRequestException('A senha deve ter pelo menos 6 caracteres');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiresAt: null },
    });
    return { success: true };
  }

  async loginWithGoogle(profile: { googleId: string; email: string; name: string; avatarUrl?: string }) {
    const email = profile.email.toLowerCase().trim();

    // Try to find by googleId first, then by email
    let user = await this.prisma.user.findFirst({ where: { googleId: profile.googleId } });

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        // Link Google account to existing user
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.googleId, avatarUrl: user.avatarUrl || profile.avatarUrl },
        });
      }
    }

    if (!user) {
      // New user — create tenant + admin account
      const tenant = await this.prisma.tenant.create({
        data: { name: `Família de ${profile.name.split(' ')[0]}`, plan: 'free', status: 'active' },
      });
      user = await this.prisma.user.create({
        data: {
          tenantId: tenant.id,
          name: profile.name,
          email,
          googleId: profile.googleId,
          avatarUrl: profile.avatarUrl,
          role: 'admin',
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.tenantId, user.role);
    return tokens;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (user && user.passwordHash && (await bcrypt.compare(password, user.passwordHash))) return user;
    return null;
  }

  private async generateTokens(userId: string, email: string, tenantId: string, role: string) {
    const payload = { sub: userId, email, tenantId, role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.prisma.refreshToken.create({ data: { userId, token: refreshToken, expiresAt } });
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, pinHash, ...safe } = user;
    return safe;
  }
}
