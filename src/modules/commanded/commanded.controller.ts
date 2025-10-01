import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { CommandedService } from './commanded.service';
import {
  CreateCommandedDto,
  CreateCommandedRangeDto,
} from './dto/create-commanded.dto';
import { UpdateCommandedDto } from './dto/update-commanded.dto';
import { Commanded } from './entities';

// Classe específica para documentação do Swagger
class PaginationCommandedResponse extends PaginationResponseDto<Commanded> {
  @ApiResponseProperty({
    type: [Commanded],
  })
  declare data: Commanded[];
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Comandas')
@Controller('commanded')
export class CommandedController {
  constructor(private readonly commandedService: CommandedService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova comanda',
    description: 'Cria uma nova comanda para o restaurante autenticado',
  })
  @ApiResponse({
    status: 201,
    description: 'Comanda criada com sucesso',
    type: Commanded,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  create(
    @Body() createCommandedDto: CreateCommandedDto,
    @Req() req: FastifyRequest,
  ) {
    const cnpj = req.user.restaurantCnpj;
    return this.commandedService.create(createCommandedDto, cnpj);
  }

  @Post('range')
  @ApiOperation({
    summary: 'Criar um range de comandas',
    description: 'Cria um range de comandas para o restaurante autenticado',
  })
  @ApiResponse({
    status: 201,
    description: 'Range de comandas criado com sucesso',
  })
  register(
    @Body() registerCommandedDto: CreateCommandedRangeDto,
    @Req() req: FastifyRequest,
  ) {
    const cnpj = req.user.restaurantCnpj;
    return this.commandedService.creteRange(registerCommandedDto, cnpj);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as comandas',
    description: 'Lista todas as comandas do restaurante autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comandas retornada com sucesso',
    type: PaginationCommandedResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.commandedService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get('open')
  @ApiOperation({
    summary: 'Lista comandas com consumo',
    description: 'Lista comandas com em aberto e com itens em aberto',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comandas retornada com sucesso',
    type: PaginationCommandedResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findAllOpen(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.commandedService.findAllOpen({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get('open/:id')
  @ApiOperation({
    summary: 'Lista comandas com consumo',
    description: 'Lista comandas com em aberto e com itens em aberto',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comandas retornada com sucesso',
    type: PaginationCommandedResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findOneOpen(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.commandedService.findOneOpen({
      id,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar uma comanda',
    description: 'Lista uma comanda do restaurante autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Comanda encontrada com sucesso',
    type: Commanded,
  })
  @ApiResponse({
    status: 404,
    description: 'Comanda não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Comanda não encontrada' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    const cnpj = req.user.restaurantCnpj;
    const commanded = await this.commandedService.findOne(id, cnpj);

    if (commanded === null) {
      throw new NotFoundException('Comanda não encontrada');
    }
    return commanded;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar uma comanda',
    description: 'Atualiza uma comanda do restaurante autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Comanda atualizada com sucesso',
    type: Commanded,
  })
  update(
    @Param('id') id: string,
    @Body() updateCommandedDto: UpdateCommandedDto,
  ) {
    return this.commandedService.update(+id, updateCommandedDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir uma comanda',
    description: 'Exclui uma comanda do restaurante autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Comanda excluída com sucesso',
  })
  remove(@Param('id') id: string) {
    return this.commandedService.remove(+id);
  }
}
