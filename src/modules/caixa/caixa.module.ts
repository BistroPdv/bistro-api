import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { CaixaController } from './caixa.controller';
import { CaixaService } from './caixa.service';

@Module({
  imports: [PrismaModule],
  controllers: [CaixaController],
  exports: [CaixaService],
  providers: [CaixaService],
})
export class CaixaModule {}
