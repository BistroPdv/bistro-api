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
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-printer.dto';
import { ProductsService } from './products.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Products')
@Controller('produtos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.productsService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.productsService.findOne(id, req.user.restaurantCnpj);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Criação de produto',
    type: CreateProductsDto,
  })
  @Post()
  async create(
    @Req() req: FastifyRequest<{ Body: Prisma.ProdutoCreateInput }>,
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

      return this.productsService.create(produtoData);
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
    type: UpdateProductsDto,
  })
  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Params: { id: string } }>,
    @Param('id') id: string,
  ) {
    try {
      const { restaurantCnpj } = req.user;
      const produto = await this.productsService.findOne(id, restaurantCnpj);

      if (!produto) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      const formData = await req.formData();

      const produtoData: Prisma.ProdutoUpdateInput = {
        nome: formData.get('nome')?.toString() || produto.nome,
        descricao: formData.get('descricao')?.toString() || produto.descricao,
        preco: formData.get('preco')
          ? Number(formData.get('preco'))
          : produto.preco,
        categoria: formData.get('categoriaId')?.toString()
          ? {
              connect: {
                id: formData.get('categoriaId')?.toString(),
              },
            }
          : undefined,
        ativo: formData.get('ativo')
          ? formData.get('ativo') === 'true'
          : produto.ativo,
        codigo: formData.get('codigo')?.toString() || produto.codigo,
        externoId: formData.get('externoId')?.toString() || produto.externoId,
        updateFrom:
          formData.get('updateFrom')?.toString() || produto.updateFrom,
        restaurant: {
          connect: {
            cnpj: restaurantCnpj,
          },
        },
        imagem:
          formData.get('imagem') instanceof File
            ? undefined
            : formData.get('imagem')?.toString() || produto.imagem,
      };

      // Verifica se imagem é do S3 interno
      if (produtoData.imagem && typeof produtoData.imagem === 'string') {
        const isS3 = produtoData.imagem
          ?.toString()
          .includes(`${process.env.S3}/${process.env.S3_BUCKET}/`);

        if (!isS3) {
          const webpFile = await urlToWebp(produtoData.imagem as string);
          const returnFile = await s3Helper.post(
            webpFile,
            `${restaurantCnpj}/produtos`,
          );

          produtoData.imagem = returnFile?.url ?? '';
        }
      }

      // Processa nova imagem se houver
      const imagem = formData.get('file');
      if (imagem && imagem instanceof File) {
        try {
          console.log(['Chegando aqui'], imagem);

          const webpFile = await convertWebp(imagem);
          const returnFile = await s3Helper.post(
            webpFile,
            `${restaurantCnpj}/produtos`,
          );

          if (returnFile?.url) {
            produtoData.imagem = returnFile.url;

            // Remove imagem antiga do S3
            const uid = produto.imagem.replace(
              `${process.env.S3}/${process.env.S3_BUCKET}/`,
              '',
            );

            const oldFile = await s3Helper.get(uid);

            if (oldFile.uid && produto.imagem.includes(process.env.S3_BUCKET)) {
              await s3Helper.del(oldFile.uid);
            }
          }
        } catch (s3Error) {
          console.error('Erro ao enviar imagem para S3:', s3Error);
          throw new HttpException(
            'Erro ao processar a imagem',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      return this.productsService.update(produtoData, id);
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
  @Put('ordem')
  async updateOrder(
    @Req()
    req: FastifyRequest<{
      Body: { id: string; ordem: number; categoriaId: string }[];
    }>,
  ) {
    const { restaurantCnpj } = req.user;
    return this.productsService.updateOrder(req.body, restaurantCnpj);
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string, @Req() req: FastifyRequest) {
    const { restaurantCnpj } = req.user;
    return this.productsService.toggleStatus(id, restaurantCnpj);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
