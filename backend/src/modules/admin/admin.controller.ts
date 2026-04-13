import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './admin.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Métricas do negócio' })
  getMetrics() { return this.adminService.getMetrics(); }

  @Get('tenants')
  @ApiOperation({ summary: 'Listar todas as famílias' })
  getTenants(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('plan') plan?: string,
    @Query('search') search?: string,
  ) { return this.adminService.getTenants(+page, +limit, plan, search); }

  @Get('export/emails')
  @ApiOperation({ summary: 'Exportar emails em CSV (retorna texto CSV)' })
  async exportEmails() {
    const csv = await this.adminService.getEmailExport();
    return { csv };
  }

  @Get('financeiro')
  @ApiOperation({ summary: 'Dados financeiros detalhados' })
  getFinanceiro() { return this.adminService.getFinanceiro(); }

  @Get('engajamento')
  @ApiOperation({ summary: 'Dados de engajamento' })
  getEngajamento() { return this.adminService.getEngajamento(); }

  @Get('marketing')
  @ApiOperation({ summary: 'Segmentos para marketing' })
  getMarketing() { return this.adminService.getMarketing(); }

  @Get('suporte')
  @ApiOperation({ summary: 'Dados para suporte' })
  getSuporte() { return this.adminService.getSuporte(); }

  @Put('tenants/:id/suspend')
  @ApiOperation({ summary: 'Suspender família' })
  suspend(@Param('id') id: string) { return this.adminService.suspendTenant(id); }

  @Put('tenants/:id/activate')
  @ApiOperation({ summary: 'Reativar família' })
  activate(@Param('id') id: string) { return this.adminService.activateTenant(id); }
}
