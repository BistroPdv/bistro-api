import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  imports: [PrismaModule],
  controllers: [BannerController],
  exports: [BannerService],
  providers: [BannerService],
})
export class BannerModule {}
