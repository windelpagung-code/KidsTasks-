import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutDto {
  @ApiProperty({ example: 'price_monthly_id' })
  @IsString()
  priceId: string;
}
