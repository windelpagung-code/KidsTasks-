import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { RedeemItemDto } from './dto/redeem-item.dto';
import { ResolveRedemptionDto } from './dto/resolve-redemption.dto';

@ApiTags('Store')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post('items')
  @ApiOperation({ summary: 'Criar item na loja' })
  createItem(@Req() req, @Body() dto: CreateStoreItemDto) {
    return this.storeService.createItem(req.user.tenantId, dto);
  }

  @Get('items')
  @ApiOperation({ summary: 'Listar itens da loja' })
  getItems(@Req() req) {
    return this.storeService.getItems(req.user.tenantId);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Atualizar item da loja' })
  updateItem(@Req() req, @Param('id') id: string, @Body() dto: UpdateStoreItemDto) {
    return this.storeService.updateItem(req.user.tenantId, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Excluir item da loja' })
  deleteItem(@Req() req, @Param('id') id: string) {
    return this.storeService.deleteItem(req.user.tenantId, id);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Solicitar resgate de item' })
  redeem(@Req() req, @Body() dto: RedeemItemDto) {
    return this.storeService.requestRedemption(req.user.tenantId, dto.childId, dto.itemId);
  }

  @Post('redemptions/:id/resolve')
  @ApiOperation({ summary: 'Aprovar ou rejeitar resgate' })
  resolve(@Req() req, @Param('id') id: string, @Body() dto: ResolveRedemptionDto) {
    return this.storeService.resolveRedemption(req.user.tenantId, req.user.id, id, dto.approved);
  }

  @Get('redemptions')
  @ApiOperation({ summary: 'Listar resgates' })
  getRedemptions(@Req() req, @Query('childId') childId?: string) {
    return this.storeService.getRedemptions(req.user.tenantId, childId);
  }
}
