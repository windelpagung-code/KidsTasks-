import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get(':childId/balance')
  @ApiOperation({ summary: 'Saldo da carteira virtual' })
  getBalance(@Req() req, @Param('childId') childId: string) {
    return this.walletService.getBalance(req.user.tenantId, childId);
  }

  @Get(':childId/transactions')
  @ApiOperation({ summary: 'Extrato de transações' })
  getTransactions(@Req() req, @Param('childId') childId: string) {
    return this.walletService.getTransactions(req.user.tenantId, childId);
  }

  @Post(':childId/transactions')
  @ApiOperation({ summary: 'Adicionar transação (crédito ou débito)' })
  addTransaction(@Req() req, @Param('childId') childId: string, @Body() body: { type: 'credit' | 'debit'; amount: number; description: string }) {
    return this.walletService.addTransaction(req.user.tenantId, childId, req.user.id, body);
  }

  @Put(':childId/transactions/:txId')
  @ApiOperation({ summary: 'Editar transação' })
  updateTransaction(@Req() req, @Param('childId') childId: string, @Param('txId') txId: string, @Body() body: { type?: 'credit' | 'debit'; amount?: number; description?: string }) {
    return this.walletService.updateTransaction(req.user.tenantId, childId, txId, body);
  }

  @Delete(':childId/transactions/:txId')
  @ApiOperation({ summary: 'Excluir transação' })
  deleteTransaction(@Req() req, @Param('childId') childId: string, @Param('txId') txId: string) {
    return this.walletService.deleteTransaction(req.user.tenantId, childId, txId);
  }

  @Post(':childId/convert-points')
  @ApiOperation({ summary: 'Converter pontos em crédito na carteira' })
  convertPoints(@Req() req, @Param('childId') childId: string, @Body() body: { points: number; rate: number }) {
    return this.walletService.convertPoints(req.user.tenantId, childId, req.user.id, body);
  }

  @Post(':childId/pay-allowance')
  @ApiOperation({ summary: 'Registrar pagamento de mesada' })
  payAllowance(@Req() req, @Param('childId') childId: string) {
    return this.walletService.markAllowancePaid(req.user.tenantId, childId, req.user.id);
  }
}
