import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  pointsCost: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  stockLimit?: number;
}
