import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Perfil do usuário logado' })
  me(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Atualizar perfil' })
  update(@Req() req, @Body() data: any) {
    return this.usersService.update(req.user.id, data);
  }

  @Get('team')
  @ApiOperation({ summary: 'Listar responsáveis da família' })
  team(@Req() req) {
    return this.usersService.getTeamMembers(req.user.tenantId);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Convidar co-responsável' })
  invite(@Req() req, @Body() body: { name: string; email: string; role?: string }) {
    return this.usersService.inviteCoResponsible(req.user.tenantId, body.email, body.role || 'editor', body.name);
  }

  @Delete('team/:id')
  @ApiOperation({ summary: 'Remover co-responsável' })
  removeTeamMember(@Req() req, @Param('id') id: string) {
    return this.usersService.removeTeamMember(req.user.tenantId, id, req.user.id);
  }
}
