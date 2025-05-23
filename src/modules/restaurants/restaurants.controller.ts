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
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Restaurantes')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.restaurantsService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':cnpj')
  async findOne(@Param('cnpj') cnpj: string) {
    return this.restaurantsService.findOne(cnpj);
  }

  @ApiBody({
    description: 'Criação de restaurante',
    type: CreateRestaurantDto,
  })
  @Post()
  async create(
    @Req() req: FastifyRequest<{ Body: Prisma.RestaurantCreateInput }>,
  ) {
    return this.restaurantsService.create(req.body);
  }

  @Put(':cnpj')
  async update(
    @Req() req: FastifyRequest<{ Body: Prisma.RestaurantUpdateInput }>,
    @Param('cnpj') cnpj: string,
  ) {
    return this.restaurantsService.update(req.body, cnpj);
  }

  @Delete(':cnpj')
  async delete(@Param('cnpj') cnpj: string) {
    return this.restaurantsService.delete(cnpj);
  }
}
