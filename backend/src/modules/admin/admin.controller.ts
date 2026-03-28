import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Métricas do negócio' })
  getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('tenants')
  @ApiOperation({ summary: 'Listar todas as famílias' })
  getTenants(@Query('page') page = 1, @Query('limit') limit = 20, @Query('plan') plan?: string) {
    return this.adminService.getTenants(+page, +limit, plan);
  }

  @Put('tenants/:id/suspend')
  @ApiOperation({ summary: 'Suspender família' })
  suspend(@Param('id') id: string) {
    return this.adminService.suspendTenant(id);
  }
}
