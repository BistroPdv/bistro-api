import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { CommandedService } from './commanded.service';
import {
  CreateCommandedDto,
  CreateCommandedRangeDto,
} from './dto/create-commanded.dto';
import { UpdateCommandedDto } from './dto/update-commanded.dto';

@UseGuards(JwtAuthGuard)
@Controller('commanded')
export class CommandedController {
  constructor(private readonly commandedService: CommandedService) {}

  @ApiOperation({
    summary: 'Criar uma nova comanda',
    description: 'Cria uma nova comanda para o restaurante autenticado',
  })
  @Post()
  create(
    @Body() createCommandedDto: CreateCommandedDto,
    @Req() req: FastifyRequest,
  ) {
    const cnpj = req.user.restaurantCnpj;
    return this.commandedService.create(createCommandedDto, cnpj);
  }
  @ApiOperation({
    summary: 'Criar um range de comandas',
    description: 'Cria um range de comandas para o restaurante autenticado',
  })
  @Post('range')
  register(
    @Body() registerCommandedDto: CreateCommandedRangeDto,
    @Req() req: FastifyRequest,
  ) {
    const cnpj = req.user.restaurantCnpj;
    return this.commandedService.creteRange(registerCommandedDto, cnpj);
  }

  @ApiOperation({
    summary: 'Listar todas as comandas',
    description: 'Lista todas as comandas do restaurante autenticado',
  })
  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.commandedService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @ApiOperation({
    summary: 'Listar uma comanda',
    description: 'Lista uma comanda do restaurante autenticado',
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.commandedService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Atualizar uma comanda',
    description: 'Atualiza uma comanda do restaurante autenticado',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommandedDto: UpdateCommandedDto,
  ) {
    return this.commandedService.update(+id, updateCommandedDto);
  }

  @ApiOperation({
    summary: 'Excluir uma comanda',
    description: 'Exclui uma comanda do restaurante autenticado',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandedService.remove(+id);
  }
}
