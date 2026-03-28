import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  amountPaid: number;
}
