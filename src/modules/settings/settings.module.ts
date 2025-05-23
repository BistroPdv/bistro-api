import { WebsocketGateway } from '@/websocket/websocket.gateway';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../..//database/prisma/prisma.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [PrismaModule],
  controllers: [SettingsController],
  exports: [SettingsService],
  providers: [SettingsService, WebsocketGateway],
})
export class SettingsModule {}
