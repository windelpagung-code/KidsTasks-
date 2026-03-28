import { IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VacationModeDto {
  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  start?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  end?: string;
}
