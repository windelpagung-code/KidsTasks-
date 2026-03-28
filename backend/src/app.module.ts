import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChildrenModule } from './modules/children/children.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AllowanceModule } from './modules/allowance/allowance.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { BadgesModule } from './modules/badges/badges.module';
import { StoreModule } from './modules/store/store.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AdminModule } from './modules/admin/admin.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { SavingsModule } from './modules/savings/savings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60') * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT || '60'),
      },
    ]),
    PrismaModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    ChildrenModule,
    TasksModule,
    AllowanceModule,
    WalletModule,
    BadgesModule,
    StoreModule,
    NotificationsModule,
    StripeModule,
    AdminModule,
    GamificationModule,
    SavingsModule,
  ],
})
export class AppModule {}
