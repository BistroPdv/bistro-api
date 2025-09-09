import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { CaixaService } from './caixa.service';
import { CreateCaixaDto } from './dto/create-caixa.dto';
import { UpdateCaixaDto } from './dto/update-caixa.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Caixa')
@Controller('caixa')
export class CaixaController {
  constructor(private readonly caixaService: CaixaService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.caixaService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.caixaService.findOne(id, req.user.restaurantCnpj);
  }

  @Get(':id/close')
  async findOneClose(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.caixaService.findOneClose(id, req.user.restaurantCnpj);
  }

  @Get('user')
  async findUserOne(@Req() req: FastifyRequest) {
    return this.caixaService.findOneUser(
      req.user.userId,
      req.user.restaurantCnpj,
    );
  }

  @ApiBody({
    description: 'Criação de caixa',
    type: CreateCaixaDto,
  })
  @Post()
  async create(@Req() req: FastifyRequest<{ Body: CreateCaixaDto }>) {
    const caixa = await this.caixaService.findOneUser(
      req.user.userId,
      req.user.restaurantCnpj,
    );

    if (caixa) {
      throw new BadRequestException('Existe um caixa aberto para o usuário');
    }

    return this.caixaService.create(
      {
        ...req.body,
        user: {
          connect: {
            id: req.user.userId,
          },
        },
        restaurant: {
          connect: {
            cnpj: req.user.restaurantCnpj,
          },
        },
      },
      req.user.restaurantCnpj,
    );
  }

  @ApiBody({
    description: 'Atualização de caixa',
    type: UpdateCaixaDto,
  })
  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Body: UpdateCaixaDto }>,
    @Param('id') id: string,
  ) {
    return this.caixaService.update(req.body, id, req.user.restaurantCnpj);
  }

  @ApiBody({
    description: 'Criação de movimentação de caixa',
  })
  @Post(':id/movement')
  async createMovementCaixa(
    @Param('id') id: string,
    @Req() req: FastifyRequest<{ Body: Prisma.CaixaMovimentacaoCreateInput }>,
  ) {
    const caixa = await this.caixaService.findOne(id, req.user.restaurantCnpj);

    if (!caixa) {
      throw new NotFoundException('Caixa não encontrado');
    }
    const caixaIsOpen = caixa.CaixaMovimentacao.find(
      (f) => f.tipo === 'ABERTURA' && req.body.tipo === 'ABERTURA',
    );

    if (caixaIsOpen) {
      throw new BadRequestException('Caixa já está aberto');
    }

    return this.caixaService.createMovementCaixa(id, req.body);
  }

  @ApiBody({
    description: 'Atualização de movimentação de caixa',
  })
  @Put(':id/movement/:movementId')
  async updateMovementCaixa(
    @Param('id') id: string,
    @Param('movementId') movementId: string,
    @Req() req: FastifyRequest<{ Body: Prisma.CaixaMovimentacaoUpdateInput }>,
  ) {
    return this.caixaService.updateMovementCaixa(movementId, id, req.body);
  }

  @ApiBody({
    description: 'Fechamento de caixa',
  })
  @Post(':id/close')
  async closeCaixa(
    @Param('id') id: string,
    @Req()
    req: FastifyRequest<{
      Body: { methods: { id: string; valor: number }[] };
    }>,
  ) {
    return this.caixaService.closeCaixa(id, req.body.methods);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.caixaService.delete(id, req.user.restaurantCnpj);
  }
}
