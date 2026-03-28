import { IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePeriodDto {
  @ApiProperty()
  @IsString()
  childId: string;

  @ApiProperty()
  @IsDateString()
  start: string;

  @ApiProperty()
  @IsDateString()
  end: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @Min(1)
  targetPoints: number;
}
