import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResolveRedemptionDto {
  @ApiProperty()
  @IsBoolean()
  approved: boolean;
}
