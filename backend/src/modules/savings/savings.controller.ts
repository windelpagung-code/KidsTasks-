import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SavingsService } from './savings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Savings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('savings')
export class SavingsController {
  constructor(private savingsService: SavingsService) {}

  // ── Conta geral ─────────────────────────────────────────────
  @Get(':childId')
  @ApiOperation({ summary: 'Conta poupança do filho (saldo geral + metas + histórico)' })
  getAccount(@Req() req, @Param('childId') childId: string) {
    return this.savingsService.getAccount(req.user.tenantId, childId);
  }

  @Post(':childId/deposit')
  @ApiOperation({ summary: 'Depositar no saldo geral' })
  deposit(@Req() req, @Param('childId') childId: string, @Body() body: { amount: number; description: string }) {
    return this.savingsService.deposit(req.user.tenantId, childId, req.user.id, body.amount, body.description);
  }

  @Post(':childId/withdraw')
  @ApiOperation({ summary: 'Retirar do saldo geral' })
  withdraw(@Req() req, @Param('childId') childId: string, @Body() body: { amount: number; description: string }) {
    return this.savingsService.withdraw(req.user.tenantId, childId, req.user.id, body.amount, body.description);
  }

  // ── Metas ────────────────────────────────────────────────────
  @Post(':childId/goals')
  @ApiOperation({ summary: 'Criar nova meta' })
  createGoal(@Req() req, @Param('childId') childId: string, @Body() body: { name: string; targetAmount: number; icon?: string }) {
    return this.savingsService.createGoal(req.user.tenantId, childId, body.name, body.targetAmount, body.icon);
  }

  @Put(':childId/goals/:goalId')
  @ApiOperation({ summary: 'Editar meta' })
  updateGoal(
    @Req() req,
    @Param('childId') childId: string,
    @Param('goalId') goalId: string,
    @Body() body: { name: string; targetAmount: number; icon?: string },
  ) {
    return this.savingsService.updateGoal(req.user.tenantId, childId, goalId, body.name, body.targetAmount, body.icon);
  }

  @Delete(':childId/goals/:goalId')
  @ApiOperation({ summary: 'Excluir meta (devolve saldo ao geral)' })
  deleteGoal(@Req() req, @Param('childId') childId: string, @Param('goalId') goalId: string) {
    return this.savingsService.deleteGoal(req.user.tenantId, childId, goalId);
  }

  @Post(':childId/goals/:goalId/allocate')
  @ApiOperation({ summary: 'Alocar saldo geral para uma meta' })
  allocateToGoal(
    @Req() req,
    @Param('childId') childId: string,
    @Param('goalId') goalId: string,
    @Body() body: { amount: number },
  ) {
    return this.savingsService.allocateToGoal(req.user.tenantId, childId, goalId, body.amount);
  }

  @Post(':childId/goals/:goalId/redeem')
  @ApiOperation({ summary: 'Resgatar meta concluída' })
  redeemGoal(@Req() req, @Param('childId') childId: string, @Param('goalId') goalId: string) {
    return this.savingsService.redeemGoal(req.user.tenantId, childId, goalId);
  }

  // ── Transações ───────────────────────────────────────────────
  @Put(':childId/transactions/:txId')
  @ApiOperation({ summary: 'Editar descrição de lançamento' })
  updateTransaction(
    @Req() req,
    @Param('childId') childId: string,
    @Param('txId') txId: string,
    @Body() body: { description: string },
  ) {
    return this.savingsService.updateTransaction(req.user.tenantId, childId, txId, body.description);
  }

  @Delete(':childId/transactions/:txId')
  @ApiOperation({ summary: 'Excluir lançamento (com estorno)' })
  deleteTransaction(@Req() req, @Param('childId') childId: string, @Param('txId') txId: string) {
    return this.savingsService.deleteTransaction(req.user.tenantId, childId, txId, req.user.id);
  }

  // ── Retrocompat: antigos endpoints de meta única ─────────────
  @Post(':childId/redeem-goal')
  redeemGoalLegacy(@Req() req, @Param('childId') childId: string) {
    return this.savingsService.redeemGoalLegacy(req.user.tenantId, childId);
  }

  @Put(':childId/goal')
  updateGoalLegacy() {
    return this.savingsService.updateGoalLegacy();
  }
}
