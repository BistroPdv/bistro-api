import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  ApiCreateErrorResponses,
  ApiDeleteErrorResponses,
  ApiFindByIdErrorResponses,
  ApiListErrorResponses,
  ApiUpdateErrorResponses,
  ApiUpdateOrderErrorResponses,
} from '@/common/decorators/api-error-responses.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import { WebsocketGateway } from '@/websocket/websocket.gateway';
import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
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
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdicionalHeader, AdicionalOptions, Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

interface AdcOptions extends AdicionalHeader {
  opcoes?: AdicionalOptions[];
}

// Classe específica para documentação do Swagger
class PaginationCategoryResponse extends PaginationResponseDto<Category> {
  @ApiProperty({
    type: [Category],
    description: 'Lista de categorias',
  })
  declare data: Category[];
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categorias')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas as categorias',
    description:
      'Retorna uma lista paginada de todas as categorias do restaurante autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    type: PaginationCategoryResponse,
  })
  @ApiListErrorResponses({
    resourceName: 'Categoria',
    resourceNamePlural: 'Categorias',
    basePath: '/categorias',
  })
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    // Validação: se status existe na query mas está undefined, retorna erro
    if ('status' in query && query.status === undefined) {
      throw new HttpException(
        {
          message: 'O parâmetro status não pode estar undefined',
          error: 'BAD_REQUEST',
          statusCode: 400,
          details:
            'Use "true" para trazer todos os itens ou "false" para trazer apenas itens ativos',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Converte o status para boolean de forma mais clara
    // Se status for 'true' (string), converte para true (boolean)
    // Se status for qualquer outra coisa (undefined, 'false', etc), mantém como false
    const status = query.status === 'true' ? true : false;

    return this.categoryService.findAll({
      ...query,
      status,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar categoria por ID',
    description: 'Retorna uma categoria específica pelo seu ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    type: Category,
  })
  @ApiFindByIdErrorResponses({
    resourceName: 'Categoria',
    resourceNamePlural: 'Categorias',
    basePath: '/categorias',
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: FastifyRequest<{ Params: { id: string } }>,
  ) {
    return this.categoryService.findOne(id, req.user.restaurantCnpj);
  }
  @Post()
  @ApiOperation({
    summary: 'Criar nova categoria',
    description: 'Cria uma nova categoria para o restaurante autenticado',
  })
  @ApiBody({
    description: 'Criação de categoria',
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: Category,
  })
  @ApiCreateErrorResponses({
    resourceName: 'Categoria',
    resourceNamePlural: 'Categorias',
    basePath: '/categorias',
  })
  async create(
    @Req() req: FastifyRequest<{ Body: Prisma.CategoriaCreateInput }>,
  ) {
    try {
      if (req.user.restaurantCnpj) {
        const adicionais = req.body.adicionais as AdcOptions[];
        delete req.body.adicionais;

        const result = await this.categoryService.create(
          {
            ...req.body,
            adicionais: {
              create: adicionais
                ? adicionais.map((a) => {
                    const op = a.opcoes;
                    delete a.opcoes;
                    return {
                      titulo: a.titulo,
                      qtdMinima: a.qtdMinima,
                      qtdMaxima: a.qtdMaxima,
                      obrigatorio: a.obrigatorio,
                      opcoes: {
                        create: op?.map((o) => ({
                          nome: o.nome,
                          preco: Number(o.preco),
                          codIntegra: o.codIntegra,
                        })),
                      },
                    };
                  })
                : [],
            },
          },
          req.user.restaurantCnpj,
        );

        if (result) {
          this.websocketGateway.server.emit(
            `produto:status:updated:${req.user.restaurantCnpj}`,
            {},
          );
        }
        return result;
      }

      throw new Error('Dados da categoria inválidos');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar categoria',
    description: 'Atualiza uma categoria existente pelo seu ID',
  })
  @ApiBody({
    description: 'Atualização de categoria',
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: Category,
  })
  @ApiUpdateErrorResponses({
    resourceName: 'Categoria',
    resourceNamePlural: 'Categorias',
    basePath: '/categorias',
  })
  async update(
    @Req()
    req: FastifyRequest<{
      Params: { id: string };
      Body: Prisma.CategoriaUpdateInput & { adicionais?: AdcOptions[] };
    }>,
    @Param('id') id: string,
  ) {
    try {
      const { restaurantCnpj } = req.user;
      const categoria = await this.categoryService.findOne(id, restaurantCnpj);

      if (!categoria) {
        throw new NotFoundException('Categoria não encontrada');
      }

      const adicionais = req.body.adicionais;
      delete req.body.adicionais;

      const result = await this.categoryService.update(
        {
          ...req.body,
          adicionais: {
            upsert: adicionais?.map((a) => {
              const op = a.opcoes;
              delete a.opcoes;
              return {
                where: { id: a.id ?? '' },
                update: {
                  titulo: a.titulo,
                  qtdMinima: Number(a.qtdMinima),
                  qtdMaxima: Number(a.qtdMaxima),
                  obrigatorio: a.obrigatorio,
                  ordem: a.ordem,
                  ativo: a.ativo,
                  opcoes: {
                    upsert: op?.map((o) => ({
                      where: { id: o.id ?? '' },
                      update: {
                        nome: o.nome,
                        delete: o.delete ?? false,
                        ativo: o.ativo,
                        preco: Number(o.preco),
                        codIntegra: o.codIntegra,
                      },
                      create: {
                        nome: o.nome,
                        ativo: o.ativo,
                        preco: Number(o.preco),
                        codIntegra: o.codIntegra,
                      },
                    })),
                  },
                },
                create: {
                  titulo: a.titulo,
                  qtdMinima: a.qtdMinima,
                  qtdMaxima: a.qtdMaxima,
                  obrigatorio: a.obrigatorio,
                  ordem: a.ordem,
                  ativo: a.ativo,
                  opcoes: {
                    create: op?.map((o) => ({
                      nome: o.nome,
                      ativo: o.ativo,
                      preco: Number(o.preco),
                      codIntegra: o.codIntegra,
                    })),
                  },
                },
              };
            }),
          },
        },
        id,
        restaurantCnpj,
      );

      if (result) {
        this.websocketGateway.server.emit(
          `produto:status:updated:${restaurantCnpj}`,
          {},
        );
      }

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro interno');
    }
  }

  @Put('ordem')
  @ApiOperation({
    summary: 'Atualizar ordem das categorias',
    description: 'Atualiza a ordem de exibição das categorias',
  })
  @ApiBody({
    description: 'Alterar Ordem de Exibição de uma categoria',
    schema: {
      example: [{ id: 'string', ordem: 'number' }],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem das categorias atualizada com sucesso',
  })
  @ApiUpdateOrderErrorResponses({
    resourceName: 'Categoria',
    resourceNamePlural: 'Categorias',
    basePath: '/categorias',
  })
  async updateOrder(
    @Req() req: FastifyRequest<{ Body: { id: string; ordem: number }[] }>,
  ) {
    try {
      const { restaurantCnpj } = req.user;
      const result = await this.categoryService.updateOrder(
        req.body,
        restaurantCnpj,
      );
      if (result) {
        this.websocketGateway.server.emit(
          `produto:ordem:updated:${restaurantCnpj}`,
          {},
        );
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro interno');
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar categoria',
    description: 'Remove uma categoria do sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria deletada com sucesso',
  })
  @ApiDeleteErrorResponses({
    resourceName: 'Categoria',
    resourceNamePlural: 'Categorias',
    basePath: '/categorias',
  })
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
