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

  @Get(':childId')
  @ApiOperation({ summary: 'Conta poupança do filho' })
  getAccount(@Req() req, @Param('childId') childId: string) {
    return this.savingsService.getAccount(req.user.tenantId, childId);
  }

  @Post(':childId/deposit')
  @ApiOperation({ summary: 'Depositar na poupança' })
  deposit(@Req() req, @Param('childId') childId: string, @Body() body: { amount: number; description: string }) {
    return this.savingsService.deposit(req.user.tenantId, childId, req.user.id, body.amount, body.description);
  }

  @Post(':childId/withdraw')
  @ApiOperation({ summary: 'Retirar da poupança' })
  withdraw(@Req() req, @Param('childId') childId: string, @Body() body: { amount: number; description: string }) {
    return this.savingsService.withdraw(req.user.tenantId, childId, req.user.id, body.amount, body.description);
  }

  @Put(':childId/transactions/:txId')
  @ApiOperation({ summary: 'Editar descrição de lançamento da poupança' })
  updateTransaction(
    @Req() req,
    @Param('childId') childId: string,
    @Param('txId') txId: string,
    @Body() body: { description: string },
  ) {
    return this.savingsService.updateTransaction(req.user.tenantId, childId, txId, body.description);
  }

  @Delete(':childId/transactions/:txId')
  @ApiOperation({ summary: 'Excluir lançamento da poupança (com estorno)' })
  deleteTransaction(@Req() req, @Param('childId') childId: string, @Param('txId') txId: string) {
    return this.savingsService.deleteTransaction(req.user.tenantId, childId, txId, req.user.id);
  }

  @Put(':childId/goal')
  @ApiOperation({ summary: 'Definir meta de poupança' })
  updateGoal(@Req() req, @Param('childId') childId: string, @Body() body: { goalName: string; goalAmount: number }) {
    return this.savingsService.updateGoal(req.user.tenantId, childId, body.goalName, body.goalAmount);
  }
}
