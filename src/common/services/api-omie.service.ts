import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface ItemsCreate {
  codigo_produto: number;
  quantidade: number;
  valor_unitario?: number;
  cfop?: string;
  codigo_cenario_impostos_item?: number;
}

@Injectable()
export class ApiOmieService {
  private api: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.api = axios.create({
      baseURL: process.env.API_OMIE,
    });
  }

  async getProductAllOmie(
    omie_key: string,
    omie_secret: string,
    pagination: {
      page: number;
      limit: number;
      cnpj: string;
    },
  ) {
    const { page = 1, limit = 10 } = pagination;

    const resp = await this.api.post(`/geral/produtos/`, {
      call: 'ListarProdutos',
      app_key: omie_key,
      app_secret: omie_secret,
      param: {
        pagina: page,
        registros_por_pagina: limit,
        apenas_importado_api: 'N',
        filtrar_apenas_omiepdv: 'N',
      },
    });

    return resp;
  }

  async getProductOmie(
    omie_key: string,
    omie_secret: string,
    codigo_produto: string,
  ) {
    const resp = await this.api.post(`/geral/produtos/`, {
      call: 'ConsultarProduto',
      param: [
        {
          codigo_produto: Number(codigo_produto),
          codigo_produto_integracao: '',
          codigo: '',
        },
      ],
      app_key: omie_key,
      app_secret: omie_secret,
    });

    return resp;
  }

  async createProductOmie(
    omie_key: string,
    omie_secret: string,
    idPedido: string,
    products: ItemsCreate[],
  ) {
    const dados = {
      call: 'AdicionarPedido',
      param: [
        {
          codigo_pedido_integracao: idPedido,
          codigo_cliente: 2533260874,
          codigo_categoria: '1.01.01',
          codigo_conta_corrente: 2394366165,
          itens: products,
        },
      ],
      app_key: omie_key,
      app_secret: omie_secret,
    };

    const resp = await this.api.post(`/produtos/pedidovenda/`, dados);

    return resp;
  }

  async gerarPedido({
    call,
    param,
    app_key,
    app_secret,
  }: {
    call: string;
    param: ItemsCreate[];
    app_key: string;
    app_secret: string;
  }) {
    const dados = {
      call,
      param,
      app_key,
      app_secret,
    };

    const resp = await this.api.post(`/produtos/pedidovenda/`, dados);

    return resp;
  }
}
