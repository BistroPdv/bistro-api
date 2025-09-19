import { Module } from '@nestjs/common';
import { CommandedService } from './commanded.service';
import { CommandedController } from './commanded.controller';

@Module({
  controllers: [CommandedController],
  providers: [CommandedService],
})
export class CommandedModule {}
