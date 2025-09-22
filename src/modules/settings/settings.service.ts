import { s3Helper } from '@/common/utils/s3.helper';
import { PrismaService } from '@/database/prisma/prisma.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface Props {
  cnpj: string;
  formData: FormData;
}

interface PropsFields extends Prisma.RestaurantUpdateInput {
  omieAppKey: string;
  omieSecretKey: string;
}

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  private select: Prisma.RestaurantSelect = {
    cnpj: true,
    name: true,
    logo: true,
    adminPassword: true,
    pdvIntegrations: true,
    integrationOmie: { select: { omie_key: true, omie_secret: true } },
    printerNotification: true,
    printerBill: true,
    email: true,
    typeService: true,
    phone: true,
    Banner: {
      where: {
        delete: false,
      },
      select: {
        id: true,
        url: true,
        nome: true,
      },
    },
  };

  async findSettings(cnpj: string) {
    const settings = await this.prisma.restaurant.findUnique({
      where: { cnpj },
      select: this.select,
    });

    if (!settings) {
      throw new NotFoundException('Configurações não encontradas');
    }

    return settings;
  }

  async updateSettings(props: Props) {
    const { cnpj, formData } = props;

    const file = formData.get('logo') as File;

    const fields: PropsFields = {} as PropsFields;
    formData.forEach((value, key) => {
      if (key !== 'logo') {
        fields[key] = value;
      }
    });

    let update = await this.prisma.restaurant.update({
      where: {
        cnpj,
      },
      data: {
        name: fields.name,
        phone: fields.phone,
        typeService: fields.typeService,
        email: fields.email,
        printerNotification: fields.printerNotification,
        printerBill: fields.printerBill,
        pdvIntegrations: fields.pdvIntegrations,
      },
      select: {
        Banner: { select: { url: true, nome: true } },
        email: true,
        name: true,
        cnpj: true,
        pdvIntegrations: true,
        integrationOmie: { select: { omie_key: true, omie_secret: true } },
        phone: true,
        typeService: true,
      },
    });

    if (fields.pdvIntegrations === 'OMIE') {
      await this.prisma.integrationOmie.upsert({
        where: {
          restaurantId: cnpj,
        },
        create: {
          omie_key: fields.omieAppKey as string,
          omie_secret: fields.omieSecretKey as string,
          restaurantId: cnpj,
        },
        update: {
          omie_key: fields.omieAppKey as string,
          omie_secret: fields.omieSecretKey as string,
        },
      });
    }

    if (update && file) {
      // Enviar para o S3
      const returnFile = await s3Helper.post(file, cnpj + `/logo`);
      console.log('ARQUIVO ENVIADO');
      if (!returnFile) {
        throw new HttpException(
          'Erro ao fazer upload do arquivo',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        update = update = await this.prisma.restaurant.update({
          where: {
            cnpj,
          },
          data: {
            logo: returnFile.url,
          },
          select: {
            Banner: { select: { url: true, nome: true } },
            typeService: true,
            email: true,
            adminPassword: true,
            name: true,
            pdvIntegrations: true,
            integrationOmie: { select: { omie_key: true, omie_secret: true } },
            cnpj: true,
            phone: true,
          },
        });
      }
    }

    return update;
  }
}
