import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkCompleteDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  assignmentIds: string[];

  @ApiProperty()
  @IsBoolean()
  done: boolean;

  @ApiPropertyOptional({ description: 'Se true, debita pontos da criança ao marcar como não feita (penalidade)' })
  @IsOptional()
  @IsBoolean()
  penalize?: boolean;
}
