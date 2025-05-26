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

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.PedidosSelect = {
    id: true,
    mesa: true,
    pdvCodPedido: true,
    produtos: {
      select: {
        adicionais: {
          select: {
            adicional: {
              select: { nome: true, preco: true, codIntegra: true },
            },
          },
        },
        produto: true,
        quantidade: true,
      },
    },
    status: true,
    createdAt: true,
    restaurant: true,
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.PedidosScalarFieldEnum, search);

    const where = buildWhere<Prisma.PedidosWhereInput>(search, cnpj);

    const total = await this.prisma.pedidos.count({ where });

    const pedidos = await this.prisma.pedidos.findMany({
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
      pedidos,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(id: string, cnpj: string) {
    return this.prisma.pedidos.findUnique({
      where: { id, delete: false, restaurant: { cnpj } },
      select: this.select,
    });
  }

  async create(data: Prisma.PedidosCreateInput) {
    delete data.id;
    return this.prisma.pedidos.create({
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async update(data: Prisma.PedidosUpdateInput, id: string) {
    return this.prisma.pedidos.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.pedidos.update({
      where: { id },
      data: { delete: true },
    });
  }
}
