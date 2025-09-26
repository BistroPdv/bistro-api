import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities';
import { RestaurantsService } from './restaurants.service';

// Classe específica para documentação do Swagger
class PaginationRestaurantResponse extends PaginationResponseDto<Restaurant> {
  @ApiResponseProperty({
    type: [Restaurant],
  })
  declare data: Restaurant[];
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Restaurantes')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os restaurantes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de restaurantes retornada com sucesso',
    type: PaginationRestaurantResponse,
  })
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
  @ApiOperation({ summary: 'Buscar restaurante por CNPJ' })
  @ApiResponse({
    status: 200,
    description: 'Restaurante encontrado com sucesso',
    type: Restaurant,
  })
  async findOne(@Param('cnpj') cnpj: string) {
    return this.restaurantsService.findOne(cnpj);
  }

  @Post()
  @ApiBody({
    description: 'Criação de restaurante',
    type: CreateRestaurantDto,
  })
  @ApiOperation({ summary: 'Criar novo restaurante' })
  @ApiResponse({
    status: 201,
    description: 'Restaurante criado com sucesso',
    type: Restaurant,
  })
  async create(
    @Req() req: FastifyRequest<{ Body: Prisma.RestaurantCreateInput }>,
  ) {
    return this.restaurantsService.create(req.body);
  }
  @Put(':cnpj')
  @ApiBody({
    description: 'Atualização de restaurante',
    type: UpdateRestaurantDto,
  })
  @ApiOperation({ summary: 'Atualizar restaurante' })
  @ApiResponse({
    status: 200,
    description: 'Restaurante atualizado com sucesso',
    type: Restaurant,
  })
  async update(
    @Req() req: FastifyRequest<{ Body: Prisma.RestaurantUpdateInput }>,
    @Param('cnpj') cnpj: string,
  ) {
    return this.restaurantsService.update(req.body, cnpj);
  }

  @Delete(':cnpj')
  @ApiOperation({ summary: 'Deletar restaurante' })
  @ApiResponse({
    status: 200,
    description: 'Restaurante deletado com sucesso',
  })
  async delete(@Param('cnpj') cnpj: string) {
    return this.restaurantsService.delete(cnpj);
  }
}
