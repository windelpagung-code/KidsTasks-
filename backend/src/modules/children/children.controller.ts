import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChildrenService } from './children.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ChildLoginDto } from './dto/child-login.dto';
import { VacationModeDto } from './dto/vacation-mode.dto';

@ApiTags('Children')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('children')
export class ChildrenController {
  constructor(private childrenService: ChildrenService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar filho' })
  create(@Req() req, @Body() dto: CreateChildDto) {
    return this.childrenService.create(req.user.tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar filhos da família' })
  findAll(@Req() req) {
    return this.childrenService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar filho por ID' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.childrenService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar filho' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateChildDto) {
    return this.childrenService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover filho' })
  remove(@Req() req, @Param('id') id: string) {
    return this.childrenService.remove(req.user.tenantId, id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login da criança por PIN' })
  childLogin(@Req() req, @Body() dto: ChildLoginDto) {
    return this.childrenService.childLogin(req.user.tenantId, dto);
  }

  @Put(':id/vacation')
  @ApiOperation({ summary: 'Ativar/desativar modo férias' })
  vacation(@Req() req, @Param('id') id: string, @Body() dto: VacationModeDto) {
    return this.childrenService.toggleVacationMode(
      req.user.tenantId,
      id,
      dto.active,
      dto.start ? new Date(dto.start) : undefined,
      dto.end ? new Date(dto.end) : undefined,
    );
  }

  @Post(':id/penalty')
  @ApiOperation({ summary: 'Aplicar penalidade ao filho' })
  penalty(@Req() req, @Param('id') id: string, @Body() dto: { type: 'points' | 'allowance'; amount: number; reason: string }) {
    return this.childrenService.applyPenalty(req.user.tenantId, id, req.user.id, dto);
  }
}
