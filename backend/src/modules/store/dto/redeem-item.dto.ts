import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedeemItemDto {
  @ApiProperty()
  @IsString()
  childId: string;

  @ApiProperty()
  @IsString()
  itemId: string;
}
