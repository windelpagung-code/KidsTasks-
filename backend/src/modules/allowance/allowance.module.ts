import { Module } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { AllowanceController } from './allowance.controller';

@Module({
  providers: [AllowanceService],
  controllers: [AllowanceController],
  exports: [AllowanceService],
})
export class AllowanceModule {}
