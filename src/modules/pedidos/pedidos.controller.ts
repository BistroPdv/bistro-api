import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import {
  ApiOmieService,
  ItemsCreate,
} from '@/common/services/api-omie.service';
import { PrismaService } from '@/database/prisma/prisma.service';
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { TablesService } from '../tables/tables.service';
import {
  CreatePedidosDto,
  EXEMPLOS_ERRO_VALIDACAO,
  EXEMPLOS_ERRO_VALIDACAO_UPDATE,
  EXEMPLOS_RESPOSTA,
  EXEMPLOS_RESPOSTA_GET_BY_MESA,
  StatusPedido,
  UpdatePedidosDto,
} from './dto';
import { Pedido } from './entities';
import { PedidoProdutoComAdicionais, PedidosService } from './pedidos.service';

// Classe específica para documentação do Swagger
class PaginationPedidosResponse extends PaginationResponseDto<Pedido> {
  @ApiResponseProperty({
    type: [Pedido],
  })
  declare data: Pedido[];
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly pedidosService: PedidosService,
    private readonly tablesService: TablesService,
    private readonly prisma: PrismaService,
    private readonly apiOmieService: ApiOmieService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os pedidos',
    description:
      'Retorna uma lista paginada de todos os pedidos do restaurante autenticado',
  })
  @ApiQuery({
    name: 'page',
    description: 'Número da página',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Quantidade de itens por página',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    description: 'Termo de busca (opcional)',
    required: false,
    example: 'PED123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso',
    type: PaginationPedidosResponse,
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
  @ApiOperation({
    summary: 'Buscar pedido por ID',
    description: 'Retorna um pedido específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do pedido',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado com sucesso',
    type: Pedido,
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Pedido não encontrado',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.pedidosService.findOne(id, req.user.restaurantCnpj);
  }

  @Get('mesa/:id')
  @ApiOperation({
    summary: 'Buscar pedidos por mesa',
    description:
      'Retorna todos os pedidos de uma mesa específica com filtro opcional por status',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da mesa',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filtrar pedidos por status',
    enum: StatusPedido,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Número da página',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Quantidade de itens por página',
    required: false,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos da mesa retornados com sucesso',
    schema: {
      example: EXEMPLOS_RESPOSTA_GET_BY_MESA.PEDIDOS_MESA_ABERTOS,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos finalizados da mesa',
    schema: {
      example: EXEMPLOS_RESPOSTA_GET_BY_MESA.PEDIDOS_MESA_FINALIZADOS,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mesa sem pedidos',
    schema: {
      example: EXEMPLOS_RESPOSTA_GET_BY_MESA.PEDIDOS_MESA_VAZIOS,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa não encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Mesa não encontrada',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  async findByMesa(
    @Param('id') id: string,
    @Query() query: PaginationQueryDto,
    @Query('status') status: 'ABERTO' | 'CANCELADO' | 'FINALIZADO',
    @Query('prodImage') prodImage: string,
    @Req() req: FastifyRequest,
  ) {
    const isProdImage = prodImage === 'true';
    return this.pedidosService.findByMesa(
      id,
      req.user.restaurantCnpj,
      query,
      status,
      isProdImage,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Criar novo pedido',
    description: 'Cria um novo pedido com produtos e adicionais.',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Dados do pedido a ser criado',
    type: CreatePedidosDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
    schema: {
      example: EXEMPLOS_RESPOSTA.PEDIDO_CRIADO,
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados inválidos - Verifique os campos obrigatórios e formatos',
    schema: {
      example: EXEMPLOS_ERRO_VALIDACAO.CAMPOS_OBRIGATORIOS,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa não encontrada ou produto não encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token JWT',
    required: true,
  })
  async create(
    @Req()
    req: FastifyRequest<{
      Body: Prisma.PedidosCreateInput & { mesaId?: string };
    }>,
  ) {
    try {
      if (!req.user.restaurantCnpj) {
        throw new HttpException('CNPJ não encontrado', HttpStatus.BAD_REQUEST);
      }

      // TODO: VERIFICAR LOGICA PARA QUANDO FOR INDOOR, VERIFICAR SE A MESA EXISTE E SE ELA ESTA DENTRO DO RANGE DO RESTAURANTE E SE NÃO ESTA OCUPADA

      // if (req.body.tipoPedido === 'INDOOR' && !req.body.mesaId) {
      //   throw new HttpException('Mesa não encontrada', HttpStatus.BAD_REQUEST);
      // } else {
      //   if (req.body.mesaId) {
      //     const mesa = await this.tablesService.findOne(
      //       req.body.mesaId,
      //       req.user.restaurantCnpj,
      //     );
      //     if (!mesa) {
      //       throw new HttpException(
      //         'Mesa não encontrada',
      //         HttpStatus.BAD_REQUEST,
      //       );
      //     }
      //   }
      // }

      const produtos = req.body.produtos as PedidoProdutoComAdicionais[];

      delete req.body.produtos;

      const result = await this.pedidosService.create(
        req.body,
        produtos,
        req.user.restaurantCnpj,
      );

      let tempProd: ItemsCreate[] = [];
      for (let i = 0; i < produtos.length; i++) {
        const p = produtos[i];
        const value = await this.prisma.produto.findUnique({
          where: { id: p.produtoId },
        });
        tempProd.push({
          codigo_produto: Number(value?.externoId),
          quantidade: p.quantidade,
          valor_unitario: value?.preco,
          cfop: '5102',
        });

        // Adicionar adicionais válidos ao pedido
        if (p.adicionais && Array.isArray(p.adicionais)) {
          for (const adicional of p.adicionais) {
            if (adicional.codIntegra && adicional.price > 0) {
              tempProd.push({
                codigo_produto: Number(adicional.codIntegra),
                quantidade: adicional.quantidade,
                valor_unitario: adicional.price,
                cfop: '5102',
              });
            }
          }
        }
      }

      const restaurant = await this.prisma.restaurant.findUnique({
        where: { cnpj: req.user.restaurantCnpj },
        select: {
          integrationOmie: true,
          pdvIntegrations: true,
        },
      });

      if (
        result &&
        produtos.length > 0 &&
        restaurant?.pdvIntegrations === 'OMIE'
      ) {
        if (
          !restaurant?.integrationOmie?.omie_key ||
          !restaurant?.integrationOmie?.omie_secret
        ) {
          throw new HttpException(
            'Configuração do Omie não encontrada',
            HttpStatus.BAD_REQUEST,
          );
        }
        const resp = await this.apiOmieService.createProductOmie(
          restaurant?.integrationOmie?.omie_key,
          restaurant?.integrationOmie?.omie_secret,
          result.id,
          tempProd,
        );

        if (resp.data.codigo_pedido) {
          await this.prisma.pedidos.update({
            where: { id: result.id },
            data: {
              pdvCodPedido: String(resp.data.codigo_pedido),
            },
          });
        }
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar pedido',
    description:
      'Atualiza um pedido existente. Esta é uma rota crítica que deve ser usada com cuidado.',
  })
  @ApiConsumes('application/json')
  @ApiParam({
    name: 'id',
    description: 'ID do pedido a ser atualizado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    description: 'Dados do pedido a ser atualizado',
    type: UpdatePedidosDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
    schema: {
      example: EXEMPLOS_RESPOSTA.PEDIDO_ATUALIZADO,
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados inválidos - Verifique os campos obrigatórios e formatos',
    schema: {
      example: EXEMPLOS_ERRO_VALIDACAO_UPDATE.PEDIDO_ID_OBRIGATORIO,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token JWT',
    required: true,
  })
  async update(
    @Param('id') id: string,
    @Req() req: FastifyRequest<{ Body: UpdatePedidosDto }>,
  ) {
    try {
      if (!req.user.restaurantCnpj) {
        throw new HttpException('CNPJ não encontrado', HttpStatus.BAD_REQUEST);
      }

      // Converter o DTO para o formato esperado pelo service
      const updateData = {
        status: req.body.status,
        pdvCodPedido: req.body.pdvCodPedido,
        motivoCancelamento: req.body.motivoCancelamento,
      };

      return this.pedidosService.update(updateData, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir pedido',
    description: 'Exclui um pedido existente (soft delete)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido a ser excluído',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido excluído com sucesso',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        delete: true,
        updatedAt: '2024-01-15T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Pedido não encontrado',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async delete(@Param('id') id: string) {
    return this.pedidosService.delete(id);
  }
}
