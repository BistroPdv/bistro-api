import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  calculatePagination,
  normalizePaginationResponse,
} from '@/common/utils/pagination.utils';
import { buildWhere } from '@/common/utils/prisma-query-builder';
import { validatePrismaFields } from '@/common/utils/prisma-validator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { orderBy } from 'lodash';

// Tipo para o item combinado baseado nos selects reais
type MovementItem = Prisma.PedidosGetPayload<{
  select: {
    createdAt: true;
    id: true;
    status: true;
    idPdv: true;
    pdvCodPedido: true;
    mesa: { select: { numero: true; id: true } };
    produtos: {
      select: {
        produto: {
          select: {
            nome: true;
            preco: true;
            descricao: true;
            codigo: true;
          };
        };
        obs: true;
      };
    };
    Payments: {
      select: {
        id: true;
        paymentMethodId: true;
        valor: true;
        troco: true;
      };
    };
  };
}> &
  Prisma.CaixaMovimentacaoGetPayload<{
    select: {
      createdAt: true;
      id: true;
      caixa: {
        select: {
          id: true;
          status: true;
        };
      };
      valor: true;
      tipo: true;
    };
  }>;

@Injectable()
export class MovementService {
  constructor(private prisma: PrismaService) {}

  private selectPedidos: Prisma.PedidosSelect = {
    createdAt: true,
    id: true,
    status: true,
    pdvCodPedido: true,
    idPdv: true,
    mesa: { select: { numero: true, id: true } },
    produtos: {
      select: {
        produto: {
          select: { nome: true, preco: true, descricao: true, codigo: true },
        },
        obs: true,
      },
    },
    Payments: {
      select: {
        id: true,
        paymentMethodId: true,
        valor: true,
        troco: true,
      },
    },
  };

  private selectCaixa: Prisma.CaixaMovimentacaoSelect = {
    createdAt: true,
    id: true,
    caixa: {
      select: {
        id: true,
        status: true,
      },
    },
    valor: true,
    tipo: true,
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(
      {
        ...Prisma.PedidosScalarFieldEnum,
        ...Prisma.CaixaMovimentacaoScalarFieldEnum,
      },
      search,
    );

    const wherePedidos = buildWhere<Prisma.PedidosWhereInput>(search, cnpj);
    const whereCaixa = buildWhere<Prisma.CaixaMovimentacaoWhereInput>(
      search,
      cnpj,
    );

    //@ts-ignore
    delete whereCaixa.delete;
    //@ts-ignore
    delete whereCaixa.restaurant;

    // Buscar todos os dados primeiro para combinar corretamente
    const [pedidos, caixa] = await Promise.all([
      this.prisma.pedidos.findMany({
        where: wherePedidos,
        select: this.selectPedidos,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.caixaMovimentacao.findMany({
        where: whereCaixa,
        select: this.selectCaixa,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Combinar e ordenar todos os dados por data de criação
    const allData: MovementItem[] = orderBy(
      [...pedidos, ...caixa],
      'createdAt',
      'desc',
    );

    const paymentMethods = await this.prisma.paymentMethod.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const dataReturn = allData.map((item) => {
      if (item.produtos) {
        const namePayment = paymentMethods.find(
          (payment) => payment.id === item.Payments[0]?.paymentMethodId,
        )?.name;
        return {
          createdAt: item.createdAt,
          tipo: 'Venda de itens',
          terminal: item.idPdv ? `PDV-${item.idPdv}` : '-',
          payment: item.Payments.length > 1 ? 'Multiplos' : namePayment,
          status: item.status === 'CANCELADO' ? 'CANCELADO' : 'VENDA',
          valor: item.Payments.reduce((acc, curr) => acc + curr.valor, 0),
          produtos: item.produtos,
          id: item.id,
        };
      } else {
        return {
          createdAt: item.createdAt,
          tipo: item.tipo,
          terminal: '-',
          payment: '-',
          status: item.tipo,
          valor: item.valor,
          id: item.id,
        };
      }
    });

    // Calcular totais para a resposta
    const totalCombined = allData.length;

    // Aplicar paginação no resultado combinado
    const paginatedData = take
      ? dataReturn.slice(skip, skip + take)
      : dataReturn;

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, totalCombined);

    return new PaginationResponseDto(
      paginatedData,
      totalCombined,
      responsePage,
      responseLimit,
    );
  }
}
