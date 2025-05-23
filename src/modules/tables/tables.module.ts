import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';

@Module({
  imports: [PrismaModule],
  controllers: [TablesController],
  exports: [TablesService],
  providers: [TablesService],
})
export class TablesModule {}
