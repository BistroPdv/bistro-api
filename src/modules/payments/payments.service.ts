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

interface PropsPayment extends PaginationDto {
  pedidoId?: string;
}

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.PaymentsSelect = {
    id: true,
    pedidoId: true,
    paymentMethodId: true,
    valor: true,
    troco: true,
  };

  async findAll(query: PropsPayment) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.MesaScalarFieldEnum, search);

    let where: Prisma.PaymentsWhereInput = search
      ? Object.keys(search).reduce(
          (acc, key) => {
            acc[key] = { contains: search[key], mode: 'insensitive' };
            return acc;
          },
          { delete: false, restaurant: { cnpj } },
        )
      : { delete: false, restaurant: { cnpj } };

    const total = await this.prisma.payments.count({ where });

    const payments = await this.prisma.payments.findMany({
      where,
      skip,
      select: this.select,
      orderBy: {
        createdAt: 'asc',
      },
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(
      payments,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(id: string, cnpj: string) {
    return this.prisma.payments.findFirst({
      where: {
        id,
        restaurantCnpj: cnpj,
      },
      select: this.select,
    });
  }

  async create(
    data: Prisma.PaymentsCreateInput & { pedidoId: string },
    cnpj: string,
  ) {
    try {
      return this.prisma.payments.create({
        select: this.select,
        data: {
          ...data,
          restaurant: { connect: { cnpj } },
          Pedidos: { connect: { id: data.pedidoId } },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(data: Prisma.PaymentsUpdateInput, id: string) {
    //@ts-ignore
    delete data.endNumber;
    return this.prisma.payments.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
      },
    });
  }
}
