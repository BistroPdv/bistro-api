import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreatePedidosDto } from './dto/create-pedidos.dto';
import { UpdatePedidosDto } from './dto/update-pedidos.dto';
import { PedidoProdutoComAdicionais, PedidosService } from './pedidos.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    try {
      return this.pedidosService.findAll({
        ...query,
        cnpj: req.user.restaurantCnpj,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.pedidosService.findOne(id, req.user.restaurantCnpj);
  }

  @Get('mesa/:id')
  async findByMesa(
    @Param('id') id: string,
    @Query() query: PaginationQueryDto,
    @Query('status') status: 'ABERTO' | 'CANCELADO' | 'FINALIZADO',
    @Req() req: FastifyRequest,
  ) {
    return this.pedidosService.findByMesa(
      id,
      req.user.restaurantCnpj,
      query,
      status,
    );
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Criação de pedido',
    type: CreatePedidosDto,
  })
  @Post()
  async create(
    @Req() req: FastifyRequest<{ Body: Prisma.PedidosCreateInput }>,
  ) {
    try {
      if (!req.user.restaurantCnpj) {
        throw new HttpException('CNPJ não encontrado', HttpStatus.BAD_REQUEST);
      }

      const produtos = req.body.produtos as PedidoProdutoComAdicionais[];

      delete req.body.produtos;

      return this.pedidosService.create(
        req.body,
        produtos,
        req.user.restaurantCnpj,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Atualização de produto',
    type: UpdatePedidosDto,
  })
  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Params: { id: string } }>,
    @Param('id') id: string,
  ) {
    try {
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBody({
    description: 'Alterar Ordem de Exibição de um produto',
    schema: {
      example: [
        { id: 'string', ordem: 'number', categoriaId: 'string' },
        { id: 'string', ordem: 'number', categoriaId: 'string' },
      ],
    },
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.pedidosService.delete(id);
  }
}
