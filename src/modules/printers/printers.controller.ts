import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { PrintersService } from './printers.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Printers')
@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.printersService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.printersService.findOne(id, req.user.restaurantCnpj);
  }

  @ApiBody({
    description: 'Criação de impressora',
    type: CreatePrinterDto,
  })
  @Post()
  async create(
    @Req() req: FastifyRequest<{ Body: Prisma.ImpressoraCreateInput }>,
  ) {
    return this.printersService.create(
      {
        ...req.body,
      },
      req.user.restaurantCnpj,
    );
  }

  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Body: Prisma.ImpressoraUpdateInput }>,
    @Param('id') id: string,
  ) {
    return this.printersService.update(req.body, id, req.user.restaurantCnpj);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.printersService.delete(id, req.user.restaurantCnpj);
  }
}
