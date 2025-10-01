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
import {
  CreateCommandedDto,
  CreateCommandedRangeDto,
} from './dto/create-commanded.dto';
import { UpdateCommandedDto } from './dto/update-commanded.dto';

interface PropsCommandedNumber extends PaginationDto {
  commandedNumber?: string;
}

@Injectable()
export class CommandedService {
  private commandedSelect: Prisma.ComandaSelect = {
    id: true,
    numero: true,
  };
  constructor(private readonly prisma: PrismaService) {}
  async create(createCommandedDto: CreateCommandedDto, cnpj: string) {
    const find = await this.prisma.comanda.findFirst({
      where: {
        restaurantCnpj: cnpj,
      },
      orderBy: {
        numero: 'asc',
      },
      select: {
        numero: true,
      },
    });
    const numero = find?.numero ? find.numero + 1 : 1;
    const commanded = await this.prisma.comanda.create({
      data: {
        restaurant: { connect: { cnpj } },
        numero,
      },
    });
    return commanded;
  }

  async creteRange(
    registerCommandedDto: CreateCommandedRangeDto,
    cnpj: string,
  ) {
    // Conforme a DTO, o campo commanded é um objeto { of: number; to: number }
    const { of, to } = registerCommandedDto;
    if (of > to) {
      throw new Error('O valor inicial não pode ser maior que o valor final');
    }

    // Verificar se algum número já existe no range
    const existingCommanded = await this.prisma.comanda.findMany({
      where: {
        restaurantCnpj: cnpj,
        numero: {
          gte: of,
          lte: to,
        },
      },
      select: {
        numero: true,
      },
    });

    if (existingCommanded.length > 0) {
      const existingNumbers = existingCommanded.map((c) => c.numero).join(', ');
      throw new Error(
        `Os números de comanda ${existingNumbers} já existem para este restaurante`,
      );
    }

    const data: { restaurantCnpj: string; numero: number }[] = [];
    for (let numero = of; numero <= to; numero++) {
      data.push({
        restaurantCnpj: cnpj,
        numero,
      });
    }
    const commanded = await this.prisma.comanda.createMany({
      data,
    });
    return commanded;
  }

  async findAll(query: PropsCommandedNumber) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.ComandaScalarFieldEnum, search);

    let where: Prisma.ComandaWhereInput = search
      ? Object.keys(search).reduce(
          (acc, key) => {
            acc[key] = { contains: search[key], mode: 'insensitive' };
            return acc;
          },
          { restaurant: { cnpj } },
        )
      : { restaurant: { cnpj } };

    if (query.commandedNumber) {
      where = { ...where, numero: Number(query.commandedNumber) };
    }

    const total = await this.prisma.comanda.count({ where });

    const commanded = await this.prisma.comanda.findMany({
      where,
      skip,
      select: this.commandedSelect,
      orderBy: {
        numero: 'asc',
      },
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(
      commanded,
      total,
      responsePage,
      responseLimit,
    );
  }

  async findAllOpen(query: PaginationDto & { cnpj: string }) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.PedidosScalarFieldEnum, search);

    const total = await this.prisma.pedidos.count({
      where: {
        AND: {
          OR: [{ status: 'ABERTO' }, { status: 'AGUARDANDO_PG' }],
          NOT: { comandaId: null },
        },
      },
    });

    const pedido = await this.prisma.pedidos.findMany({
      where: {
        restaurantCnpj: cnpj,
        AND: {
          OR: [{ status: 'ABERTO' }, { status: 'AGUARDANDO_PG' }],
          NOT: { comandaId: null },
        },
      },
      select: {
        mesa: { select: { numero: true, id: true } },
        comanda: { select: { id: true, numero: true } },
        produtos: {
          select: {
            obs: true,
            quantidade: true,
            status: true,
            produto: { select: { nome: true, preco: true, imagem: true } },
            adicionais: {
              select: { adicional: { select: { nome: true, preco: true } } },
            },
          },
        },
      },
      skip,
      orderBy: {
        comanda: { numero: 'asc' },
      },
      take: take ?? total,
    });

    return pedido;
  }

  async findOneOpen({ cnpj, id }: { cnpj: string; id: string }) {
    const numero = isNaN(Number(id)) ? 0 : Number(id);
    console.log(numero);
    const pedido = await this.prisma.pedidos.findFirst({
      where: {
        restaurantCnpj: cnpj,
        status: 'ABERTO',
        comanda: { numero },
      },
      select: {
        id: true,
        mesa: { select: { numero: true, id: true } },
        comanda: { select: { id: true, numero: true } },
        produtos: {
          select: {
            obs: true,
            quantidade: true,
            status: true,
            produto: {
              select: { id: true, nome: true, preco: true, imagem: true },
            },
            adicionais: {
              select: {
                adicional: { select: { id: true, nome: true, preco: true } },
              },
            },
          },
        },
      },
      orderBy: {
        comanda: { numero: 'asc' },
      },
    });

    return pedido;
  }

  findOne(id: string, cnpj: string) {
    const numero = isNaN(Number(id)) ? 0 : Number(id);
    const commanded = this.prisma.comanda.findFirst({
      where: {
        OR: [{ id: id.toString() }, { numero: numero }],
        restaurant: { cnpj },
      },
      select: this.commandedSelect,
    });
    return commanded;
  }

  update(id: number, updateCommandedDto: UpdateCommandedDto) {
    return `This action updates a #${id} commanded`;
  }

  remove(id: number) {
    return `This action removes a #${id} commanded`;
  }
}
