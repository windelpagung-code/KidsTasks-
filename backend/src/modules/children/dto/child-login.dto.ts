import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChildLoginDto {
  @ApiProperty()
  @IsString()
  childId: string;

  @ApiProperty()
  @IsString()
  pin: string;
}
