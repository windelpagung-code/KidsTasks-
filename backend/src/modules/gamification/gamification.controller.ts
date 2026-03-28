import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gamification')
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Get('ranking')
  @ApiOperation({ summary: 'Ranking entre irmãos' })
  @ApiQuery({ name: 'period', enum: ['weekly', 'monthly'], required: false })
  getRanking(@Req() req, @Query('period') period: 'weekly' | 'monthly' = 'weekly') {
    return this.gamificationService.getRanking(req.user.tenantId, period);
  }

  @Get('dashboard/:childId')
  @ApiOperation({ summary: 'Dashboard lúdico da criança' })
  getChildDashboard(@Req() req, @Param('childId') childId: string) {
    return this.gamificationService.getChildDashboard(req.user.tenantId, childId);
  }
}
