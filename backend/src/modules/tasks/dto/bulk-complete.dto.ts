import { IsArray, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkCompleteDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  assignmentIds: string[];

  @ApiProperty()
  @IsBoolean()
  done: boolean;
}
