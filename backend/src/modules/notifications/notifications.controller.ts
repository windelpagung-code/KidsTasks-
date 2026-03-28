import { Controller, Get, Put, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificações' })
  getAll(@Req() req) {
    return this.notificationsService.getNotifications(req.user.id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  markRead(@Req() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Marcar todas como lidas' })
  markAllRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}
