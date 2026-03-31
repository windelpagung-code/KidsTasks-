import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { BulkCompleteDto } from './dto/bulk-complete.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar tarefa' })
  create(@Req() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.tenantId, req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarefas' })
  @ApiQuery({ name: 'childId', required: false })
  findAll(@Req() req, @Query('childId') childId?: string) {
    return this.tasksService.findAll(req.user.tenantId, childId);
  }

  @Get('child/:childId')
  @ApiOperation({ summary: 'Tarefas da criança (painel lúdico)' })
  getChildTasks(@Req() req, @Param('childId') childId: string) {
    return this.tasksService.getChildTasks(req.user.tenantId, childId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Histórico de tarefas concluídas por data' })
  @ApiQuery({ name: 'date', required: false, description: 'Data no formato YYYY-MM-DD. Padrão: hoje.' })
  @ApiQuery({ name: 'childId', required: false })
  getHistory(
    @Req() req,
    @Query('date') date?: string,
    @Query('childId') childId?: string,
  ) {
    return this.tasksService.getHistory(req.user.tenantId, date, childId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar tarefa' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desativar tarefa' })
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.tenantId, id);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reordenar tarefas' })
  reorder(@Req() req, @Body() body: { ids: string[] }) {
    return this.tasksService.reorder(req.user.tenantId, body.ids);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Marcar tarefa como concluída' })
  complete(@Req() req, @Body() dto: CompleteTaskDto) {
    return this.tasksService.completeTask(req.user.tenantId, req.user.id, dto);
  }

  @Post('bulk-complete')
  @ApiOperation({ summary: 'Marcar em lote (para lista impressa)' })
  bulkComplete(@Req() req, @Body() dto: BulkCompleteDto) {
    return this.tasksService.bulkComplete(req.user.tenantId, req.user.id, dto.assignmentIds, dto.done);
  }

  @Put(':id/approve/:assignmentId')
  @ApiOperation({ summary: 'Aprovar tarefa concluída' })
  approve(@Req() req, @Param('assignmentId') assignmentId: string) {
    return this.tasksService.approveTask(req.user.tenantId, req.user.id, assignmentId);
  }
}
