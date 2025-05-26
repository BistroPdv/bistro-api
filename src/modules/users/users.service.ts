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
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.UserSelect = {
    id: true,
    ativo: true,
    nome: true,
    username: true,
    email: true,
    role: true,
  };

  async findAll(query: PaginationDto) {
    const { page, limit, search, cnpj } = query;
    const { skip, take } = calculatePagination(page, limit);

    validatePrismaFields(Prisma.UserScalarFieldEnum, search);

    const where = buildWhere<Prisma.UserWhereInput>(search, cnpj);

    const total = await this.prisma.user.count({ where });

    const users = await this.prisma.user.findMany({
      where,
      skip,
      select: this.select,
      take: take ?? total,
    });

    const { page: responsePage, limit: responseLimit } =
      normalizePaginationResponse(page, limit, total);

    return new PaginationResponseDto(users, total, responsePage, responseLimit);
  }

  async findOne(id: string, cnpj: string) {
    return this.prisma.user.findUnique({
      where: { id, delete: false, restaurant: { cnpj } },
      select: this.select,
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      select: this.select,
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async update(data: Prisma.UserUpdateInput, id: string) {
    const hashedPassword = await bcrypt.hash(data.password as string, 10);
    return this.prisma.user.update({
      where: { id },
      select: this.select,
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async toggleActive(cnpj: string, id: string) {
    const active = await this.prisma.user.findUnique({ where: { id } });
    if (!active) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return this.prisma.user.update({
      where: { id, restaurantCnpj: cnpj },
      data: { ativo: { set: !active.ativo } },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
