import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  calculatePagination,
  normalizePaginationResponse,
} from '@/common/utils/pagination.utils';
import { buildWhere } from '@/common/utils/prisma-query-builder';
import { validatePrismaFields } from '@/common/utils/prisma-validator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.ProdutoSelect = {
    id: true,
    nome: true,
    descricao: true,
    preco: true,
    imagem: true,
    restaurantCnpj: true,
    categoriaId: true,
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.ProdutoScalarFieldEnum, search);

    const where = buildWhere<Prisma.ProdutoWhereInput>(search, cnpj);

    const total = await this.prisma.produto.count({ where });

    const products = await this.prisma.produto.findMany({
      where,
      skip,
      select: this.select,
      orderBy: {
        ordem: 'asc',
      },
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(
      products,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(id: string, cnpj: string) {
    return this.prisma.produto.findUnique({
      where: { id, delete: false, restaurant: { cnpj } },
      select: this.select,
    });
  }

  async create(data: Prisma.ProdutoCreateInput) {
    delete data.id;
    return this.prisma.produto.create({
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async update(data: Prisma.ProdutoUpdateInput, id: string) {
    return this.prisma.produto.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async updateOrder(
    data: { id: string; ordem: number; categoriaId: string }[],
    restaurantCnpj: string,
  ) {
    const produtos = data.map(async (item) => {
      const produto = await this.prisma.produto.findUnique({
        where: { id: item.id, restaurantCnpj, categoriaId: item.categoriaId },
      });
      if (!produto) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }
      return this.prisma.produto.update({
        where: {
          id: item.id,
          restaurantCnpj,
          categoriaId: item.categoriaId,
        },
        data: { ordem: item.ordem },
      });
    });
    const [result] = await Promise.all(produtos);
    return result;
  }

  async delete(id: string) {
    return this.prisma.produto.update({
      where: { id },
      data: { delete: true },
    });
  }
}
