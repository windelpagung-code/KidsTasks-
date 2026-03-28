import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AllowanceService } from './allowance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePeriodDto } from './dto/create-period.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@ApiTags('Allowance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('allowance')
export class AllowanceController {
  constructor(private allowanceService: AllowanceService) {}

  @Post('periods')
  @ApiOperation({ summary: 'Criar período de mesada' })
  createPeriod(@Req() req, @Body() dto: CreatePeriodDto) {
    return this.allowanceService.createPeriod(
      dto.childId, req.user.tenantId,
      new Date(dto.start), new Date(dto.end), dto.targetPoints,
    );
  }

  @Post('periods/:id/close')
  @ApiOperation({ summary: 'Fechar e calcular mesada do período' })
  closePeriod(@Param('id') id: string) {
    return this.allowanceService.calculateAndClose(id);
  }

  @Post('periods/:id/pay')
  @ApiOperation({ summary: 'Confirmar pagamento da mesada' })
  confirmPayment(@Req() req, @Param('id') id: string, @Body() dto: ConfirmPaymentDto) {
    return this.allowanceService.confirmPayment(id, req.user.id, dto.amountPaid);
  }

  @Get('periods')
  @ApiOperation({ summary: 'Listar períodos de mesada' })
  getPeriods(@Req() req, @Query('childId') childId?: string) {
    return this.allowanceService.getPeriods(req.user.tenantId, childId);
  }

  @Get('periods/current/:childId')
  @ApiOperation({ summary: 'Período atual de um filho' })
  getCurrentPeriod(@Req() req, @Param('childId') childId: string) {
    return this.allowanceService.getCurrentPeriod(req.user.tenantId, childId);
  }
}
