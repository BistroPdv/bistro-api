import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { WebsocketGateway } from '@/websocket/websocket.gateway';
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
  constructor(
    private readonly printersService: PrintersService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly prisma: PrismaService,
  ) {}

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
    const response = await this.printersService.create(
      {
        ...req.body,
      },
      req.user.restaurantCnpj,
    );

    if (response) {
      const printers = await this.printersService.findAll({
        cnpj: req.user.restaurantCnpj,
      });
      const tokenPrinterServer = await this.prisma.restaurant.findUnique({
        where: { cnpj: req.user.restaurantCnpj },
        select: { printerServerToken: true },
      });
      if (tokenPrinterServer) {
        this.websocketGateway.server.emit(
          `printer:get-all:${tokenPrinterServer.printerServerToken}`,
          printers.data,
        );
      }
    }

    return response;
  }

  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Body: Prisma.ImpressoraUpdateInput }>,
    @Param('id') id: string,
  ) {
    const response = await this.printersService.update(
      req.body,
      id,
      req.user.restaurantCnpj,
    );

    if (response) {
      const printers = await this.printersService.findAll({
        cnpj: req.user.restaurantCnpj,
      });
      const tokenPrinterServer = await this.prisma.restaurant.findUnique({
        where: { cnpj: req.user.restaurantCnpj },
        select: { printerServerToken: true },
      });
      console.log(tokenPrinterServer);
      if (tokenPrinterServer) {
        this.websocketGateway.server.emit(
          `printer:get-all:${tokenPrinterServer.printerServerToken}`,
          printers.data,
        );
      }
    }
    return response;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: FastifyRequest) {
    const response = await this.printersService.delete(
      id,
      req.user.restaurantCnpj,
    );
    if (response) {
      const tokenPrinterServer = await this.prisma.restaurant.findUnique({
        where: { cnpj: req.user.restaurantCnpj },
        select: { printerServerToken: true },
      });
      if (tokenPrinterServer) {
        this.websocketGateway.server.emit(
          `printer:delete:${tokenPrinterServer.printerServerToken}`,
          id,
        );
      }
    }
    return response;
  }
}
