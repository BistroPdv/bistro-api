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

interface PropsMesaNumber extends PaginationDto {
  mesaNumber?: string;
}

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.MesaSelect = {
    id: true,
    numero: true,
    capacity: true,
    location: true,
  };

  async findAll(query: PropsMesaNumber) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.MesaScalarFieldEnum, search);

    let where: Prisma.MesaWhereInput = search
      ? Object.keys(search).reduce(
          (acc, key) => {
            acc[key] = { contains: search[key], mode: 'insensitive' };
            return acc;
          },
          { delete: false, restaurant: { cnpj } },
        )
      : { delete: false, restaurant: { cnpj } };

    if (query.mesaNumber) {
      where = { ...where, numero: Number(query.mesaNumber) };
    }

    const total = await this.prisma.mesa.count({ where });

    const tables = await this.prisma.mesa.findMany({
      where,
      skip,
      select: this.select,
      orderBy: {
        numero: 'asc',
      },
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(
      tables,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findOne(numero: number | string, cnpj: string) {
    return this.prisma.mesa.findFirst({
      where: {
        OR: [{ numero: Number(numero) }, { id: numero.toString() }],
        delete: false,
        restaurantCnpj: cnpj,
      },
      select: this.select,
    });
  }

  async findAvailability(cnpj: string) {
    const availability = {
      tablesAvailable: 0,
      tablesUnavailable: 0,
      dataTables: [],
      availabilityCapacity: {} as Record<number, number>,
    };
    const pedidos = await this.prisma.pedidos.findMany({
      where: {
        delete: false,
        restaurantCnpj: cnpj,
        status: 'ABERTO',
      },
      select: {
        mesaId: true,
      },
    });

    const mesas = await this.prisma.mesa.findMany({
      where: {
        delete: false,
        restaurantCnpj: cnpj,
      },
      select: {
        id: true,
        numero: true,
        capacity: true,
        inUse: true,
        group: true,
      },
      orderBy: {
        numero: 'asc',
      },
    });

    const mesasAvailable = mesas.map((mesa) => {
      if (pedidos.some((pedido) => pedido.mesaId === mesa.id)) {
        availability.tablesUnavailable++;
        return { ...mesa, available: false };
      }
      availability.tablesAvailable++;
      availability.availabilityCapacity[mesa.capacity || 0] =
        (availability.availabilityCapacity[mesa.capacity || 0] || 0) + 1;
      return { ...mesa, available: true };
    });
    availability.dataTables = mesasAvailable as any;

    return availability;
  }

  async create(data: Prisma.MesaCreateInput, cnpj: string, endNumber?: number) {
    try {
      delete data.id;

      if (endNumber && endNumber > data.numero) {
        const mesas: any = [];
        for (let i = data.numero; i <= endNumber; i++) {
          const mesa = await this.prisma.mesa.create({
            select: this.select,
            data: {
              ...data,
              restaurant: { connect: { cnpj } },
              numero: i,
            },
          });
          mesas.push(mesa);
        }
        return mesas;
      }

      return this.prisma.mesa.create({
        select: this.select,
        data: {
          ...data,
          restaurant: { connect: { cnpj } },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(data: Prisma.MesaUpdateInput, id: string) {
    //@ts-ignore
    delete data.endNumber;
    return this.prisma.mesa.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.mesa.update({
      where: { id },
      data: { delete: true },
    });
  }
}
