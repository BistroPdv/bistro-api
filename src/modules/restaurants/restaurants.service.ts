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
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.RestaurantSelect = {
    cnpj: true,
    appToken: true,
    name: true,
    email: true,
    phone: true,
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.RestaurantScalarFieldEnum, search);

    const where = buildWhere<Prisma.RestaurantWhereInput>(search, cnpj);

    const total = await this.prisma.restaurant.count({ where });

    const restaurants = await this.prisma.restaurant.findMany({
      where,
      skip,
      select: this.select,
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(
      restaurants,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(cnpj: string) {
    return this.prisma.restaurant.findUnique({
      where: { cnpj },
      select: this.select,
    });
  }

  async create(data: Prisma.RestaurantCreateInput) {
    return this.prisma.restaurant.create({
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async update(data: Prisma.RestaurantUpdateInput, cnpj: string) {
    return this.prisma.restaurant.update({
      where: { cnpj },
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async delete(cnpj: string) {
    return this.prisma.restaurant.delete({ where: { cnpj } });
  }
}
