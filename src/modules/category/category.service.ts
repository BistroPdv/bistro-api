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
        categoria: { select: { id: true, nome: true } },
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
          where: { delete: false },
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
    const { page, limit, search, cnpj, status } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.CategoriaScalarFieldEnum, search);

    let select = { ...this.select };

    // Se status for false ou undefined, traz apenas itens ativos
    // Se status for true, traz todos os itens (ativos e inativos)
    if (query.status !== true) {
      if (select.produtos && typeof select.produtos === 'object') {
        select.produtos.where = {
          ...select.produtos.where,
          ...{ ativo: true }, // status=false traz apenas ativos, status=true traz todos
        };
      }
      if (select.adicionais && typeof select.adicionais === 'object') {
        select.adicionais.where = {
          ...select.adicionais.where,
          ...{ ativo: true }, // status=false traz apenas ativos, status=true traz todos
        };
        if (
          select.adicionais.select?.opcoes &&
          typeof select.adicionais.select?.opcoes === 'object'
        ) {
          select.adicionais.select.opcoes.where = {
            ...select.adicionais.select.opcoes.where,
            ...{ ativo: true }, // status=false traz apenas ativos, status=true traz todos
          };
        }
      }
    }

    const where = buildWhere<Prisma.CategoriaWhereInput>(search, cnpj);

    const total = await this.prisma.categoria.count({
      where: { ...where, ...(status !== true && { ativo: true }) },
    });

    const categories = await this.prisma.categoria.findMany({
      where: { ...where, ...(status !== true && { ativo: true }) },
      skip,
      select,
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

  async create(data: Prisma.CategoriaCreateInput, cnpj: string) {
    delete data.id;
    const isName = await this.prisma.categoria.findFirst({
      where: {
        nome: { equals: data.nome, mode: 'insensitive' },
        restaurantCnpj: cnpj,
      },
    });
    if (isName) {
      throw new HttpException('Nome já existe', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.categoria.create({
      select: this.select,
      data: {
        ...data,
        restaurant: { connect: { cnpj } },
      },
    });
  }

  async update(data: Prisma.CategoriaUpdateInput, id: string, cnpj: string) {
    //@ts-ignore
    if (data.impressoraId) {
      //@ts-ignore
      data.Impressora = { connect: data.ImpressoraID };

      //@ts-ignore
      delete data.impressoraId;
    }
    return this.prisma.categoria.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
        restaurant: { connect: { cnpj } },
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
