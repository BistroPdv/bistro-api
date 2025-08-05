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
import { PaymentMethod, Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethodService } from './payment-method.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Payment Method')
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.paymentMethodService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.paymentMethodService.findOne(id, req.user.restaurantCnpj);
  }

  @ApiBody({
    description: 'Criação de método de pagamento',
    type: CreatePaymentMethodDto,
  })
  @Post()
  async create(
    @Req() req: FastifyRequest<{ Body: Prisma.PaymentMethodCreateInput }>,
  ) {
    return this.paymentMethodService.create(
      {
        ...req.body,
      },
      req.user.restaurantCnpj,
    );
  }

  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Body: PaymentMethod }>,
    @Param('id') id: string,
  ) {
    return this.paymentMethodService.update(
      req.body,
      id,
      req.user.restaurantCnpj,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.paymentMethodService.delete(id, req.user.restaurantCnpj);
  }
}
