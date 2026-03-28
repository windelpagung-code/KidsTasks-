import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenant')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Dados da família' })
  findOne(@Req() req) {
    return this.tenantsService.findOne(req.user.tenantId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard principal dos pais' })
  getDashboard(@Req() req) {
    return this.tenantsService.getDashboard(req.user.tenantId);
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar dados da família' })
  update(@Req() req, @Body() data: any) {
    return this.tenantsService.update(req.user.tenantId, data);
  }
}
