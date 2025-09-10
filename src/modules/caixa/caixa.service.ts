import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  calculatePagination,
  normalizePaginationResponse,
} from '@/common/utils/pagination.utils';
import { validatePrismaFields } from '@/common/utils/prisma-validator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RelatorioFechamentoCaixaDto } from './dto/relatorio-fechamento-caixa.dto';

@Injectable()
export class CaixaService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.CaixaSelect = {
    id: true,
    CaixaMovimentacao: true,
    status: true,
    createdAt: true,
    user: {
      select: {
        id: true,
        nome: true,
      },
    },
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.CaixaScalarFieldEnum, search);

    const where: Prisma.CaixaWhereInput = search
      ? Object.keys(search).reduce(
          (acc, key) => {
            acc[key] = { contains: search[key], mode: 'insensitive' };
            return acc;
          },
          { delete: false, restaurant: { cnpj } },
        )
      : { delete: false, restaurant: { cnpj } };

    const total = await this.prisma.caixa.count({ where });

    const caixas = await this.prisma.caixa.findMany({
      where,
      skip,
      select: this.select,
      orderBy: {
        createdAt: 'desc',
      },
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(
      caixas,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(id: string, cnpj: string) {
    return this.prisma.caixa.findUnique({
      where: { id, delete: false, restaurant: { cnpj } },
      select: this.select,
    });
  }

  async findOneClose(
    id: string,
    cnpj: string,
  ): Promise<RelatorioFechamentoCaixaDto> {
    const caixa = await this.prisma.caixa.findUnique({
      where: { id, delete: false, restaurant: { cnpj } },
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    if (!caixa) {
      throw new BadRequestException('Caixa não encontrado');
    }

    // Buscar dados do fechamento
    const caixaFechamento = await this.prisma.caixaFechamento.findFirst({
      where: { caixaId: id },
      include: {
        caixaFechamentoMethodPayment: {
          include: {
            methodPayment: true,
          },
        },
      },
    });

    if (!caixaFechamento) {
      throw new BadRequestException('Caixa não foi fechado ainda');
    }

    // Buscar movimentações do caixa
    const movimentacoes = await this.prisma.caixaMovimentacao.findMany({
      where: { caixaId: id },
    });

    // Buscar vendas do caixa com pagamentos
    const vendas = await this.prisma.pedidos.findMany({
      where: { caixaId: id },
      include: {
        Payments: true,
      },
    });

    // Buscar todos os métodos de pagamento para mapear os IDs
    const todosMetodosPagamento = await this.prisma.paymentMethod.findMany({
      where: { restaurantCnpj: cnpj, delete: false },
    });

    const metodosMap = new Map(
      todosMetodosPagamento.map((method) => [method.id, method]),
    );

    // Calcular totais das vendas por método de pagamento
    const vendasPorMetodo = new Map<
      string,
      { nome: string; tipo: string; valor: number }
    >();

    vendas.forEach((venda) => {
      venda.Payments.forEach((payment) => {
        const methodId = payment.paymentMethodId;
        const method = metodosMap.get(methodId);

        if (method) {
          if (vendasPorMetodo.has(methodId)) {
            const atual = vendasPorMetodo.get(methodId);
            if (atual) {
              atual.valor += payment.valor;
            }
          } else {
            vendasPorMetodo.set(methodId, {
              nome: method.name,
              tipo: method.type,
              valor: payment.valor,
            });
          }
        }
      });
    });

    // Calcular totais das movimentações considerando o tipo
    const totalMovimentacoes = movimentacoes.reduce((acc, curr) => {
      if (curr.tipo === 'ABERTURA' || curr.tipo === 'ENTRADA') {
        return acc + curr.valor; // Adição
      } else if (curr.tipo === 'SANGRIA' || curr.tipo === 'SAIDA') {
        return acc - curr.valor; // Subtração
      }
      return acc;
    }, 0);
    const totalVendas = vendas.reduce(
      (acc, venda) =>
        acc + venda.Payments.reduce((acc, payment) => acc + payment.valor, 0),
      0,
    );
    const totalTroco = vendas.reduce(
      (acc, venda) =>
        acc +
        venda.Payments.reduce((acc, payment) => acc + (payment.troco || 0), 0),
      0,
    );

    // Preparar relatório dos métodos de pagamento
    const relatorioMetodosPagamento =
      caixaFechamento.caixaFechamentoMethodPayment.map((metodo) => {
        const vendaReal = vendasPorMetodo.get(metodo.methodPaymentId);
        const valorReal = vendaReal ? vendaReal.valor : 0;
        const diferenca = metodo.valor - valorReal;

        return {
          id: metodo.methodPaymentId,
          nome: metodo.methodPayment.name,
          tipo: metodo.methodPayment.type,
          valorInformado: metodo.valor,
          descricao: metodo.methodPayment.description || '',
          valorReal,
          diferenca,
        };
      });

    const totalInformado = relatorioMetodosPagamento.reduce(
      (acc, metodo) => acc + metodo.valorInformado,
      0,
    );
    const totalReal = relatorioMetodosPagamento.reduce(
      (acc, metodo) => acc + metodo.valorReal,
      0,
    );
    const diferencaTotal = totalInformado - totalReal;

    return {
      caixa: {
        id: caixa.id,
        status: caixa.status,
        createdAt: caixa.createdAt,
        user: caixa.user
          ? { id: caixa.user.id, nome: caixa.user.nome || '' }
          : { id: '', nome: '' },
      },
      vendas: vendas.map((venda) => ({
        id: venda.id,
        status: venda.status.toString(),
        tipoPedido: venda.tipoPedido?.toString() || 'COUNTER',
        createdAt: venda.createdAt,
        total: venda.Payments.reduce((acc, payment) => acc + payment.valor, 0),
        troco: venda.Payments.reduce(
          (acc, payment) => acc + (payment.troco || 0),
          0,
        ),
        payments: venda.Payments.map((payment) => ({
          id: payment.id,
          valor: payment.valor,
          troco: payment.troco || 0,
          methodPaymentId: payment.paymentMethodId,
        })),
      })),
      movimentacoes: movimentacoes.map((mov) => ({
        id: mov.id,
        valor: mov.valor,
        tipo: mov.tipo,
        createdAt: mov.createdAt,
      })),
      fechamento: {
        id: caixaFechamento.id,
        totalMoment: caixaFechamento.totalMoment,
        totalMethods: caixaFechamento.totalMethods,
        totalChange: caixaFechamento.totalChange,
        createAt: caixaFechamento.createAt,
        metodosPagamento: relatorioMetodosPagamento,
      },
      resumo: {
        totalVendas,
        totalMovimentacoes,
        totalTroco,
        totalInformado,
        totalReal,
        diferencaTotal,
      },
    };
  }

  async findOneUser(userId: string, cnpj: string) {
    return this.prisma.caixa.findFirst({
      where: {
        user: { id: userId },
        delete: false,
        status: true,
        restaurant: { cnpj },
      },
      select: this.select,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: Prisma.CaixaCreateInput, cnpj: string) {
    delete data.id;
    return this.prisma.caixa.create({
      select: this.select,
      data: {
        ...data,
        restaurant: { connect: { cnpj } },
      },
    });
  }

  async update(data: Prisma.CaixaUpdateInput, id: string, cnpj: string) {
    return this.prisma.caixa.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async createMovementCaixa(
    idCaixa: string,
    data: Prisma.CaixaMovimentacaoCreateInput,
  ) {
    return this.prisma.caixaMovimentacao.create({
      data: {
        ...data,
        caixa: { connect: { id: idCaixa } },
      },
    });
  }

  async updateMovementCaixa(
    id: string,
    idCaixa: string,
    data: Prisma.CaixaMovimentacaoUpdateInput,
  ) {
    return this.prisma.caixaMovimentacao.update({
      where: { id, caixa: { id: idCaixa } },
      data,
    });
  }

  async closeCaixa(
    idCaixa: string,
    methods: {
      id: string;
      valor: number;
    }[],
  ) {
    const isOpen = await this.prisma.caixa.findUnique({
      where: { id: idCaixa },
      select: { status: true },
    });

    if (!isOpen) {
      throw new BadRequestException('Caixa já está fechado');
    }

    const moviment = await this.prisma.caixaMovimentacao.findMany({
      where: { caixa: { id: idCaixa } },
    });

    const vendas = await this.prisma.pedidos.findMany({
      select: {
        Payments: {
          select: {
            valor: true,
            troco: true,
          },
        },
      },
      where: { caixaId: idCaixa },
    });

    const totalMoment = moviment.reduce((acc, curr) => acc + curr.valor, 0);
    const totalChange = vendas.reduce(
      (acc, curr) =>
        acc + curr.Payments.reduce((acc, curr) => acc + (curr.troco || 0), 0),
      0,
    );
    const totalMethods = vendas.reduce(
      (acc, curr) =>
        acc + curr.Payments.reduce((acc, curr) => acc + curr.valor, 0),
      0,
    );

    await this.prisma.caixaFechamento.create({
      data: {
        totalMoment,
        totalChange,
        totalMethods,
        caixaFechamentoMethodPayment: {
          create: methods.map((method) => ({
            methodPayment: {
              connect: { id: method.id },
            },
            valor: method.valor,
          })),
        },
      },
    });

    return this.prisma.caixa.update({
      where: { id: idCaixa },
      data: { status: false },
    });
  }

  async delete(id: string, cnpj: string) {
    return this.prisma.caixa.update({
      where: { id, restaurant: { cnpj } },
      data: { delete: true },
    });
  }
}
