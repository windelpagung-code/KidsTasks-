import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Difficulty, RecurrenceType } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Arrumar a cama' })
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: '🛏️' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false, example: 'limpeza' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ enum: Difficulty, default: 'easy' })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  basePoints?: number;

  @ApiProperty({ enum: RecurrenceType })
  @IsEnum(RecurrenceType)
  recurrenceType: RecurrenceType;

  @ApiProperty({ required: false, example: [1, 3, 5] })
  @IsOptional()
  @IsArray()
  recurrenceDays?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false, example: ['child-id-1'] })
  @IsOptional()
  @IsArray()
  childIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  periodEnd?: string;
}
