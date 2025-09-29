import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  calculatePagination,
  normalizePaginationResponse,
} from '@/common/utils/pagination.utils';
import { buildWhere } from '@/common/utils/prisma-query-builder';
import { validatePrismaFields } from '@/common/utils/prisma-validator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface Adicional {
  id: string;
  codIntegra: string | null;
  quantidade: number;
  price: number;
}

export interface PedidoProdutoComAdicionais
  extends Prisma.PedidoProdutoCreateManyInput {
  adicionais?: Adicional[];
}

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  private select = (prodImage?: boolean): Prisma.PedidosSelect => ({
    id: true,
    status: true,
    pdvCodPedido: true,
    createdAt: true,
    mesa: { select: { numero: true, id: true } },
    produtos: {
      select: {
        produto: {
          select: {
            nome: true,
            preco: true,
            descricao: true,
            codigo: true,
            imagem: prodImage,
          },
        },
        obs: true,
        adicionais: {
          select: {
            adicional: {
              select: { nome: true, preco: true, codIntegra: true },
            },
            quantidade: true,
            preco: true,
          },
        },
        quantidade: true,
        status: true,
      },
    },
    HistoryPedido: {
      select: {
        type: true,
        pedidoId: true,
        pedido: {
          select: {
            produtos: {
              select: {
                produto: {
                  select: {
                    nome: true,
                    preco: true,
                    descricao: true,
                    codigo: true,
                    imagem: prodImage,
                  },
                },
                adicionais: {
                  select: {
                    adicional: {
                      select: { nome: true, preco: true, codIntegra: true },
                    },
                    quantidade: true,
                    preco: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.PedidosScalarFieldEnum, search);

    const where = buildWhere<Prisma.PedidosWhereInput>(search, cnpj);

    const total = await this.prisma.pedidos.count({ where });

    const pedidos = await this.prisma.pedidos.findMany({
      where,
      skip,
      select: this.select(),
      orderBy: {
        createdAt: 'desc',
      },
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(
      pedidos,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(id: string, cnpj: string, prodImage?: boolean) {
    return this.prisma.pedidos.findUnique({
      where: { id, delete: false, restaurant: { cnpj } },
      select: this.select(prodImage ?? false),
    });
  }

  async findByMesa(
    id: string,
    cnpj: string,
    query: PaginationQueryDto,
    status: 'ABERTO' | 'CANCELADO' | 'FINALIZADO',
    prodImage?: boolean,
    comandaId?: string,
  ) {
    const { page, limit } = query;
    const { skip, take } = calculatePagination(page, limit);

    if (!cnpj) {
      throw new NotFoundException('CNPJ não encontrado');
    }

    const isMesa = await this.prisma.mesa.findUnique({
      where: { id, restaurant: { cnpj } },
    });

    if (!isMesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    const where: Prisma.PedidosWhereInput = comandaId
      ? {
          delete: false,
          comandaId,
          restaurantCnpj: cnpj,
          ...(status ? { status } : {}),
        }
      : {
          delete: false,
          mesaId: id,
          restaurantCnpj: cnpj,
          ...(status ? { status } : {}),
        };

    const [data, total] = await Promise.all([
      this.prisma.pedidos.findMany({
        where,
        select: {
          ...this.select(prodImage ?? false),
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.pedidos.count({ where }),
    ]);

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(data, total, responsePage, responseLimit);
  }

  async create(
    data: Prisma.PedidosCreateInput & {
      mesaId?: string;
      caixaId?: string;
      userId?: string;
      comandaId?: string;
    },
    produtos: PedidoProdutoComAdicionais[],
    cnpj: string,
  ) {
    const createData: Prisma.PedidosCreateInput = {
      ...data,
      status: 'ABERTO',
      restaurant: {
        connect: { cnpj },
      },
    };

    if (data.mesaId) {
      createData.mesa = { connect: { id: data.mesaId } };
    }

    if (data.caixaId) {
      createData.Caixa = { connect: { id: data.caixaId } };
    }

    if (data.userId) {
      createData.user = { connect: { id: data.userId } };
    }

    if (data.comandaId) {
      createData.comanda = { connect: { id: data.comandaId } };
    }

    // Se comandaId existe, conectar com a comanda
    if ((data as any).comandaId) {
      createData.comanda = { connect: { id: (data as any).comandaId } };
    }

    // Remover campos auxiliares que não existem no schema
    delete (createData as any).mesaId;
    delete (createData as any).caixaId;
    delete (createData as any).userId;
    delete (createData as any).comandaId;

    const create = await this.prisma.pedidos.create({
      data: createData,
    });

    if (create) {
      await this.prisma.historyPedido.create({
        data: {
          pedidoId: create.id,
          type: 'CREATED',
        },
      });

      for (const p of produtos) {
        const pedidoProduto = await this.prisma.pedidoProduto.create({
          data: {
            status: p.status,
            pedidoId: create.id,
            produtoId: p.produtoId,
            obs: p.obs,
            externoId: p.externoId,
            quantidade: p.quantidade,
            commandedId: p.commandedId,
          },
        });

        if (p.adicionais && p.adicionais.length > 0) {
          await this.prisma.pedidoProdutoAdicional.createMany({
            data: p.adicionais.map((a) => ({
              pedidoProdutoId: pedidoProduto.id,
              adicionalId: a.id,
              quantidade: a.quantidade,
              preco: a.price,
            })),
          });
        }
      }
    }

    return create;
  }

  async update(
    data: Prisma.PedidosUpdateInput & {
      mesaId?: string;
      caixaId?: string;
      userId?: string;
    },
    produtos: PedidoProdutoComAdicionais[],
    id: string,
    cnpj: string,
  ) {
    // Primeiro, verificar se o pedido existe
    const existingPedido = await this.prisma.pedidos.findUnique({
      where: { id, restaurantCnpj: cnpj },
      select: { id: true, pdvCodPedido: true },
    });

    if (!existingPedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Preparar dados de atualização
    const updateData: Prisma.PedidosUpdateInput = {
      ...data,
    };

    if (data.mesaId) {
      updateData.mesa = { connect: { id: data.mesaId } };
    }

    if (data.caixaId) {
      updateData.Caixa = { connect: { id: data.caixaId } };
    }

    if (data.userId) {
      updateData.user = { connect: { id: data.userId } };
    }

    // Se comandaId existe, conectar com a comanda
    if ((data as any).comandaId) {
      updateData.comanda = { connect: { id: (data as any).comandaId } };
    }

    // Remover campos auxiliares que não existem no schema
    delete (updateData as any).mesaId;
    delete (updateData as any).caixaId;
    delete (updateData as any).userId;
    delete (updateData as any).comandaId;

    // Atualizar o pedido
    const updatedPedido = await this.prisma.pedidos.update({
      where: { id },
      data: updateData,
    });

    // Se há produtos para atualizar
    if (produtos && produtos.length > 0) {
      // Criar novos produtos
      for (const p of produtos) {
        const pedidoProduto = await this.prisma.pedidoProduto.create({
          data: {
            status: p.status,
            pedidoId: id,
            produtoId: p.produtoId,
            obs: p.obs,
            externoId: p.externoId,
            quantidade: p.quantidade,
            commandedId: p.commandedId,
          },
        });

        if (p.adicionais && p.adicionais.length > 0) {
          await this.prisma.pedidoProdutoAdicional.createMany({
            data: p.adicionais.map((a) => ({
              pedidoProdutoId: pedidoProduto.id,
              adicionalId: a.id,
              quantidade: a.quantidade,
              preco: a.price,
            })),
          });
        }
      }

      // Criar histórico de atualização
      await this.prisma.historyPedido.create({
        data: {
          pedidoId: id,
          type: 'UPDATED',
        },
      });
    }

    return updatedPedido;
  }

  async delete(id: string) {
    return this.prisma.pedidos.update({
      where: { id },
      data: { delete: true },
    });
  }
}
