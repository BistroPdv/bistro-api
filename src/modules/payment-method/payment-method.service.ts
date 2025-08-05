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
export class PaymentMethodService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.PaymentMethodSelect = {
    id: true,
    nome: true,
    delete: true,
    createAt: true,
    updateAt: true,
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.ImpressoraScalarFieldEnum, search);

    const where: Prisma.PaymentMethodWhereInput = search
      ? Object.keys(search).reduce(
          (acc, key) => {
            acc[key] = { contains: search[key], mode: 'insensitive' };
            return acc;
          },
          { delete: false, restaurant: { cnpj } },
        )
      : { delete: false, restaurant: { cnpj } };

    const total = await this.prisma.paymentMethod.count({ where });

    const paymentMethods = await this.prisma.paymentMethod.findMany({
      where,
      skip,
      select: this.select,
      orderBy: {
        createAt: 'desc',
      },
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(
      paymentMethods,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(id: string, cnpj: string) {
    return this.prisma.paymentMethod.findUnique({
      where: { id, delete: false, restaurant: { cnpj } },
      select: this.select,
    });
  }

  async create(data: Prisma.PaymentMethodCreateInput, cnpj: string) {
    delete data.id;
    return this.prisma.paymentMethod.create({
      select: this.select,
      data: {
        ...data,
        restaurant: { connect: { cnpj } },
      },
    });
  }

  async update(
    data: Prisma.PaymentMethodUpdateInput,
    id: string,
    cnpj: string,
  ) {
    return this.prisma.paymentMethod.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async delete(id: string, cnpj: string) {
    return this.prisma.paymentMethod.update({
      where: { id, restaurant: { cnpj } },
      data: { delete: true },
    });
  }
}
