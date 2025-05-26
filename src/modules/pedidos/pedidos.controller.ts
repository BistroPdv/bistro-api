import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import convertWebp from '@/common/utils/convert-webp';
import { s3Helper } from '@/common/utils/s3.helper';
import urlToWebp from '@/common/utils/url-to-webp';
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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreatePedidosDto } from './dto/create-pedidos.dto';
import { UpdatePedidosDto } from './dto/update-pedidos.dto';
import { PedidosService } from './pedidos.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
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
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.pedidosService.findOne(id, req.user.restaurantCnpj);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Criação de pedido',
    type: CreatePedidosDto,
  })
  @Post()
  async create(
    @Req() req: FastifyRequest<{ Body: Prisma.PedidosCreateInput }>,
  ) {
    try {
      const { restaurantCnpj } = req.user;
      const formData = await req.formData();

      const produtoData: any = {
        nome: formData.get('nome')?.toString(),
        descricao: formData.get('descricao')?.toString(),
        preco: formData.get('preco') ? Number(formData.get('preco')) : 0,
        categoriaId: formData.get('categoriaId')?.toString(),
        ativo: formData.get('ativo') ? formData.get('ativo') === 'true' : true,
        codigo: formData.get('codigo')?.toString(),
        imagem: formData.get('imagem')?.toString() || '',
        externoId: formData.get('externoId')?.toString(),
        updateFrom: formData.get('updateFrom')?.toString(),
        restaurantCnpj,
      };

      if (produtoData.imagem) {
        const isS3 = produtoData.imagem.includes(
          `${process.env.S3_MINIO_URL}/${process.env.S3_MINIO_BUCKETS}/`,
        );

        if (!isS3) {
          const webpFile = await urlToWebp(produtoData.imagem);
          const returnFile = await s3Helper.post(
            webpFile,
            `${restaurantCnpj}/produtos`,
          );
          produtoData.imagem = returnFile?.url ?? '';
        }
      }

      const imagem = formData.get('file');
      if (imagem && imagem instanceof File) {
        try {
          const webpFile = await convertWebp(imagem);
          const returnFile = await s3Helper.post(
            webpFile,
            `${restaurantCnpj}/produtos`,
          );

          if (returnFile?.url) {
            produtoData.imagem = returnFile?.url ?? '';
          }
        } catch (s3Error) {
          console.error('Erro ao enviar imagem para S3:', s3Error);
          throw new HttpException(
            'Erro ao processar a imagem',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      return this.pedidosService.create(produtoData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Atualização de produto',
    type: UpdatePedidosDto,
  })
  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Params: { id: string } }>,
    @Param('id') id: string,
  ) {
    try {
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBody({
    description: 'Alterar Ordem de Exibição de um produto',
    schema: {
      example: [
        { id: 'string', ordem: 'number', categoriaId: 'string' },
        { id: 'string', ordem: 'number', categoriaId: 'string' },
      ],
    },
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.pedidosService.delete(id);
  }
}
