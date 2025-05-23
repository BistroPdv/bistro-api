import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { s3Helper } from '@/common/utils/s3.helper';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
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
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Banner')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.bannerService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Criação de banner',
    type: CreateBannerDto,
  })
  @Post()
  async create(@Req() req: FastifyRequest) {
    try {
      const formData = await req.formData();

      if (!formData) {
        throw new BadRequestException('Nenhum dado foi enviado');
      }

      const file = formData.get('banner');
      if (!file || !(file instanceof Blob)) {
        throw new BadRequestException('Arquivo inválido');
      }

      const fields: any = {};
      formData.forEach((value, key) => {
        if (key !== 'banner') {
          fields[key] = value;
        }
      });

      // Enviar para o S3
      const returnFile = await s3Helper.post(
        file,
        req.user.restaurantCnpj + `/banner`,
      );

      if (!returnFile) {
        throw new InternalServerErrorException(
          'Erro ao fazer upload do arquivo',
        );
      }

      const bannerData = {
        url: returnFile.url,
        nome: returnFile.fileName,
        restaurant: {
          connect: {
            cnpj: req.user.restaurantCnpj,
          },
        },
        ordem: 1,
        tempo: 1000,
      };

      const response = await this.bannerService.create(bannerData);
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Body: Prisma.BannerUpdateInput }>,
    @Param('id') id: string,
  ) {
    console.log(req.body);
    return this.bannerService.update(req.body, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bannerService.delete(id);
  }
}
