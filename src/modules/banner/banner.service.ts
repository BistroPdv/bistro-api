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
export class BannerService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.BannerSelect = {
    id: true,
    url: true,
    nome: true,
    ordem: true,
    tempo: true,
    restaurantCnpj: true,
    delete: true,
    createAt: true,
    updateAt: true,
    restaurant: {
      select: {
        cnpj: true,
        name: true,
      },
    },
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.BannerScalarFieldEnum, search);

    const where: Prisma.BannerWhereInput = search
      ? Object.keys(search).reduce(
          (acc, key) => {
            acc[key] = { contains: search[key], mode: 'insensitive' };
            return acc;
          },
          { delete: false, restaurant: { cnpj } },
        )
      : { delete: false, restaurant: { cnpj } };

    const total = await this.prisma.banner.count({ where });

    const banner = await this.prisma.banner.findMany({
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
      banner,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(id: string) {
    return this.prisma.banner.findUnique({
      where: { id, delete: false },
      select: this.select,
    });
  }

  async create(data: Prisma.BannerCreateInput) {
    delete data.id;
    return this.prisma.banner.create({
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async update(data: Prisma.BannerUpdateInput, id: string) {
    return this.prisma.banner.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.banner.update({
      where: { id },
      select: this.select,
      data: { delete: true },
    });
  }
}
