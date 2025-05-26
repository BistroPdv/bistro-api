import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

@Module({
  imports: [PrismaModule],
  controllers: [PedidosController],
  exports: [PedidosService],
  providers: [PedidosService],
})
export class PedidosModule {}
