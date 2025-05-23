import { Module } from '@nestjs/common';
import { PrismaModule } from '../..//database/prisma/prisma.module';
import { PrintersController } from './printers.controller';
import { PrintersService } from './printers.service';

@Module({
  imports: [PrismaModule],
  controllers: [PrintersController],
  exports: [PrintersService],
  providers: [PrintersService],
})
export class PrintersModule {}
