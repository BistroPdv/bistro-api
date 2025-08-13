import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
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
      return this.movementService.findAll({
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
}
