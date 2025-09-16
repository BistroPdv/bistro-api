import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreateMovementDto } from './dto/create-moviment.dto';
import { MovementService } from './movement.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Movimentação de caixa e vendas')
@Controller('movement')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar movimentações de caixa e vendas',
    description:
      'Retorna uma lista paginada de todas as movimentações de caixa e vendas do restaurante autenticado',
  })
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    try {
      return this.movementService.findAll(
        {
          ...query,
          cnpj: req.user.restaurantCnpj,
        },
        req.user.userId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Criar movimentação de caixa',
    description: 'Cria uma nova movimentação de caixa',
  })
  @ApiBody({
    description: 'Dados da movimentação de caixa',
    type: CreateMovementDto,
  })
  async createMovementCaixa(
    @Req() req: FastifyRequest<{ Body: Prisma.CaixaMovimentacaoCreateInput }>,
  ) {
    return this.movementService.createMovementCaixa(req.body, req.user.userId);
  }
}
