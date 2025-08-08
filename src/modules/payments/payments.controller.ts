import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  Controller,
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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { PaymentsService } from './payments.service';

interface PropsPayments extends Prisma.PaymentsCreateInput {
  endNumber?: number;
}

interface PropsQueryDtoPayment extends PaginationQueryDto {
  paymentNumber?: string;
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(
    @Query() query: PropsQueryDtoPayment,
    @Req() req: FastifyRequest,
  ) {
    return this.paymentsService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.paymentsService.findOne(id, req.user.restaurantCnpj);
  }

  // @Get(':mesaNumber')
  // async findTable(@Param('mesaNumber') mesaNumber: string, @Req() req: FastifyRequest) {
  //   return this.tablesService.findOne(Number(mesaNumber), req.user.restaurantCnpj);
  // }

  @ApiBody({
    description: 'Criação de pagamento',
    type: CreatePaymentDto,
  })
  @Post()
  async create(@Req() req: FastifyRequest<{ Body: PropsPayments }>) {
    try {
      if (!req.user.restaurantCnpj) {
        throw new HttpException('Dados da mesa inválido', HttpStatus.NOT_FOUND);
      }

      const result = await this.paymentsService.create(
        req.body,
        req.user.restaurantCnpj,
      );

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Body: Prisma.PaymentsUpdateInput }>,
    @Param('id') id: string,
  ) {
    console.log(req.body);
    return this.paymentsService.update(req.body, id);
  }
}
