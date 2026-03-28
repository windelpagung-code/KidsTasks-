import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteTaskDto {
  @ApiProperty()
  @IsString()
  assignmentId: string;
}
