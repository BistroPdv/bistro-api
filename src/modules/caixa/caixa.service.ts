import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  calculatePagination,
  normalizePaginationResponse,
} from '@/common/utils/pagination.utils';
import { validatePrismaFields } from '@/common/utils/prisma-validator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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

  async delete(id: string, cnpj: string) {
    return this.prisma.caixa.update({
      where: { id, restaurant: { cnpj } },
      data: { delete: true },
    });
  }
}
