import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentMethodController],
  exports: [PaymentMethodService],
  providers: [PaymentMethodService],
})
export class PaymentMethodModule {}
