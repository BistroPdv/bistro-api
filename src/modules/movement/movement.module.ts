import { PrismaModule } from '@/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';

@Module({
  imports: [PrismaModule],
  controllers: [MovementController],
  exports: [MovementService],
  providers: [MovementService],
})
export class MovementModule {}
