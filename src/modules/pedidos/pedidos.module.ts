import { ApiOmieService } from '@/common/services/api-omie.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { TablesModule } from '../tables/tables.module';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

@Module({
  imports: [PrismaModule, TablesModule],
  controllers: [PedidosController],
  exports: [PedidosService],
  providers: [PedidosService, ApiOmieService],
})
export class PedidosModule {}
