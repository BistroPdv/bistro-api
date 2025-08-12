import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { IntegrationsService } from './integrations.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Integrações')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('omie/list-produtos')
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    try {
      const { page = 1, limit = 10 } = query as {
        page?: number;
        limit?: number;
      };

      if (!req.user || !req.user.restaurantCnpj) {
        // ApiError pode ser uma classe customizada, ajuste conforme sua implementação
        return {
          statusCode: 401,
          error: 'Usuário não autenticado ou sem restaurante associado',
        };
      }

      // Considerando Next.js API, retornando objeto ao invés de usar reply
      const result = await this.integrationsService.getProductAllOmie(
        page,
        limit,
        req.user.restaurantCnpj,
      );
      return {
        statusCode: 200,
        data: result,
      };
    } catch (error) {
      if (error?.statusCode && error?.error) {
        return {
          statusCode: error.statusCode,
          error: error.error,
        };
      }
      return {
        statusCode: 500,
        error: 'Erro interno do servidor',
      };
    }
  }

  @Get('/omie/produto/:codigo_produto')
  async findOne(
    @Param('codigo_produto') codigo_produto: string,
    @Req() req: FastifyRequest,
  ) {
    return this.integrationsService.getProductOmie(
      codigo_produto,
      req.user.restaurantCnpj,
    );
  }
}
