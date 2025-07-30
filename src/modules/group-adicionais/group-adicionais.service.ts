import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupAdicionaisService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.ImpressoraSelect = {
    id: true,
    ip: true,
    porta: true,
    nome: true,
  };

  async delete(id: string, cnpj: string) {
    const add = await this.prisma.adicionalHeader.findUnique({
      where: { id },
    });

    if (!add) {
      throw new NotFoundException('Grupo de adicionais não encontrado');
    }

    const result = await this.prisma.adicionalHeader.update({
      where: { id },
      data: { delete: true },
    });
    return result;
  }
}
