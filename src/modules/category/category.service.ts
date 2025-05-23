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
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.CategoriaSelect = {
    id: true,
    status: true,
    nome: true,
    imagem: true,
    cor: true,
    ativo: true,
    ordem: true,
    temPromocao: true,
    externoId: true,
    restaurantCnpj: true,
    delete: true,
    createAt: true,
    updateAt: true,
    impressoraId: true,
    produtos: {
      where: { delete: false },
      select: {
        id: true,
        ativo: true,
        nome: true,
        descricao: true,
        imagem: true,
        preco: true,
        ordem: true,
        categoriaId: true,
        externoId: true,
        codigo: true,
        restaurantCnpj: true,
        delete: true,
        createAt: true,
        updateAt: true,
        updateFrom: true,
        categoria: { select: { id: true } },
      },
    },
    adicionais: {
      where: { delete: false },
      select: {
        id: true,
        titulo: true,
        ativo: true,
        ordem: true,
        qtdMinima: true,
        qtdMaxima: true,
        obrigatorio: true,
        delete: true,
        createAt: true,
        updateAt: true,
        categoriaId: true,
        opcoes: {
          select: {
            id: true,
            nome: true,
            preco: true,
            codIntegra: true,
            ativo: true,
            createAt: true,
            updateAt: true,
            delete: true,
            adicionalHeaderId: true,
          },
        },
      },
    },
    Impressora: {
      where: { delete: false },
      select: {
        id: true,
        nome: true,
        ip: true,
        porta: true,
        delete: true,
        createAt: true,
        updateAt: true,
        restaurantCnpj: true,
      },
    },
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.CategoriaScalarFieldEnum, search);

    const where = buildWhere<Prisma.CategoriaWhereInput>(search, cnpj);

    const total = await this.prisma.categoria.count({ where });

    const categories = await this.prisma.categoria.findMany({
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
      categories,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(id: string, restaurantCnpj: string) {
    return this.prisma.categoria.findUnique({
      where: { id, delete: false, restaurant: { cnpj: restaurantCnpj } },
      select: this.select,
    });
  }

  async create(data: Prisma.CategoriaCreateInput) {
    delete data.id;
    return this.prisma.categoria.create({
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async update(data: Prisma.CategoriaUpdateInput, id: string) {
    return this.prisma.categoria.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async updateOrder(
    data: { id: string; ordem: number }[],
    restaurantCnpj: string,
  ) {
    const categorias = data.map(async (item) => {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: item.id, restaurantCnpj },
      });
      if (!categoria) {
        throw new HttpException(
          'Categoria não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      return this.prisma.categoria.update({
        where: { id: item.id, restaurantCnpj },
        data: { ordem: item.ordem },
      });
    });
    const [result] = await Promise.all(categorias);
    return result;
  }

  async delete(id: string) {
    return this.prisma.categoria.update({
      where: { id },
      data: { delete: true },
    });
  }
}
