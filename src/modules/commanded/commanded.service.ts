import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCommandedDto } from './dto/create-commanded.dto';
import { UpdateCommandedDto } from './dto/update-commanded.dto';

@Injectable()
export class CommandedService {
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

  findAll() {
    return `This action returns all commanded`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commanded`;
  }

  update(id: number, updateCommandedDto: UpdateCommandedDto) {
    return `This action updates a #${id} commanded`;
  }

  remove(id: number) {
    return `This action removes a #${id} commanded`;
  }
}
