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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreateTableDto } from './dto/create-tables.dto';
import { TablesService } from './tables.service';

interface PropsMesas extends Prisma.MesaCreateInput {
  endNumber?: number;
}

interface PropsQueryDtoMesa extends PaginationQueryDto {
  mesaNumber?: string;
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Mesas')
@Controller('mesas')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  async findAll(
    @Query() query: PropsQueryDtoMesa,
    @Req() req: FastifyRequest,
  ) {
    
    return this.tablesService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.tablesService.findOne(Number(id), req.user.restaurantCnpj);
  }

  // @Get(':mesaNumber')
  // async findTable(@Param('mesaNumber') mesaNumber: string, @Req() req: FastifyRequest) {
  //   return this.tablesService.findOne(Number(mesaNumber), req.user.restaurantCnpj);
  // }

  @ApiBody({
    description: 'Criação de mesa',
    type: CreateTableDto,
  })
  @Post()
  async create(@Req() req: FastifyRequest<{ Body: PropsMesas }>) {
    try {
      if (!req.user.restaurantCnpj) {
        throw new HttpException('Dados da mesa inválido', HttpStatus.NOT_FOUND);
      }

      if (
        req.body.endNumber &&
        req.body.endNumber > 0 &&
        req.body.endNumber < req.body.numero
      ) {
        throw new HttpException(
          'O número da mesa final não pode ser menor que o número da mesa inicial',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isExist = await this.tablesService.findOne(
        req.body.numero,
        req.user.restaurantCnpj,
      );

      if (isExist) {
        throw new HttpException('Mesa já existe', HttpStatus.BAD_REQUEST);
      }

      const endNumber = req.body.endNumber;
      delete req.body.endNumber;

      const result = await this.tablesService.create(
        {
          ...req.body,
        },
        req.user.restaurantCnpj,
        endNumber,
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
    @Req() req: FastifyRequest<{ Body: Prisma.MesaUpdateInput }>,
    @Param('id') id: string,
  ) {
    console.log(req.body);
    return this.tablesService.update(req.body, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tablesService.delete(id);
  }
}
