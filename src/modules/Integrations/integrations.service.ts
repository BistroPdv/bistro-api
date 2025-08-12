import { ApiOmieService } from '@/common/services/api-omie.service';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private apiOmieService: ApiOmieService,
  ) {}

  async getProductAllOmie(page: number = 1, limit: number = 10, cnpj: string) {
    // Busca o restaurante pelo CNPJ e traz as integrações relevantes
    const restaurant = await this.prisma.restaurant.findUnique({
      where: {
        cnpj,
      },
      select: {
        pdvIntegrations: true,
        integrationOmie: true,
      },
    });

    if (!restaurant) {
      throw new Error('Restaurante não encontrado');
    }

    if (restaurant.pdvIntegrations !== 'OMIE') {
      throw new Error('Restaurante não integrado com o Omie');
      // throw new ApiError("Restaurante não integrado com o Omie", 400);
    }

    if (!restaurant.integrationOmie) {
      throw new Error('Configuração do Omie não encontrada');
      // throw new ApiError("Configuração do Omie não encontrada", 400);
    }

    // Aqui você deve garantir que apiOmie está importado e configurado corretamente
    const resp = await this.apiOmieService.getProductAllOmie(
      restaurant.integrationOmie.omie_key,
      restaurant.integrationOmie.omie_secret,
      { page, limit, cnpj },
    );

    return resp.data;
  }

  async getProductOmie(codigo_produto: string, cnpj: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { cnpj },
      select: {
        pdvIntegrations: true,
        integrationOmie: true,
      },
    });

    if (!restaurant) {
      throw new Error('Restaurante não encontrado');
    }

    if (restaurant.pdvIntegrations !== 'OMIE') {
      throw new Error('Restaurante não integrado com o Omie');
    }

    if (!restaurant.integrationOmie) {
      throw new Error('Configuração do Omie não encontrada');
    }

    const resp = await this.apiOmieService.getProductOmie(
      restaurant.integrationOmie.omie_key,
      restaurant.integrationOmie.omie_secret,
      codigo_produto,
    );

    return resp.data;
  }
}
