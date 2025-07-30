import { Module } from '@nestjs/common';
import { PrismaModule } from '../..//database/prisma/prisma.module';
import { GroupAdicionaisController } from './group-adicionais.controller';
import { GroupAdicionaisService } from './group-adicionais.service';

@Module({
  imports: [PrismaModule],
  controllers: [GroupAdicionaisController],
  exports: [GroupAdicionaisService],
  providers: [GroupAdicionaisService],
})
export class GroupAdicionaisModule {}
