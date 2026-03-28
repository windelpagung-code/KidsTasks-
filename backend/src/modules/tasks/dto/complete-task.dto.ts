import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteTaskDto {
  @ApiProperty()
  @IsString()
  assignmentId: string;

  @ApiPropertyOptional({ description: 'Data em que a tarefa foi realmente feita (ISO 8601). Padrão: agora.' })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
