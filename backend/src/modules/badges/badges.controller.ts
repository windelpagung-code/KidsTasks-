import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Badges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('badges')
export class BadgesController {
  constructor(private badgesService: BadgesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os badges' })
  findAll() {
    return this.badgesService.findAll();
  }

  @Get('child/:childId')
  @ApiOperation({ summary: 'Badges conquistados pela criança' })
  getChildBadges(@Req() req, @Param('childId') childId: string) {
    return this.badgesService.getChildBadges(req.user.tenantId, childId);
  }
}
