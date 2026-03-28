import { IsString, IsOptional, IsDateString, IsNumber, IsEnum, Min, Max, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AllowanceRule } from '@prisma/client';

export class CreateChildDto {
  @ApiProperty({ example: 'Sofia' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Sofi', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ example: '2015-05-15' })
  @IsDateString()
  birthdate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ example: '1234', required: false })
  @IsOptional()
  @IsString()
  pin?: string;

  @ApiProperty({ example: 50.00, required: false })
  @IsOptional()
  @IsNumber()
  allowanceAmount?: number;

  @ApiProperty({ example: 'monthly', required: false })
  @IsOptional()
  @IsString()
  allowanceFrequency?: string;

  @ApiProperty({ enum: AllowanceRule, required: false })
  @IsOptional()
  @IsEnum(AllowanceRule)
  allowanceRule?: AllowanceRule;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  thresholdPercent?: number;

  @ApiProperty({ example: 5, description: 'Dia do mês para pagamento da mesada (1-28)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(28)
  allowanceDay?: number;
}
