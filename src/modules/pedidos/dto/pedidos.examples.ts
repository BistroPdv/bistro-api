/**
 * Exemplos de pedidos para documentação
 * Este arquivo contém exemplos práticos de uso dos DTOs de pedidos
 */

import {
  CreatePedidosDto,
  StatusPedido,
  StatusProduto,
} from './create-pedidos.dto';
import { PedidoExample, UpdatePedidoExample } from './pedidos.types';
import { UpdatePedidosDto } from './update-pedidos.dto';

// UUIDs de exemplo (devem ser substituídos por UUIDs reais em produção)
export const EXAMPLE_UUIDS = {
  MESA_1: '550e8400-e29b-41d4-a716-446655440000',
  MESA_2: '550e8400-e29b-41d4-a716-446655440001',
  PRODUTO_HAMBURGUER: '550e8400-e29b-41d4-a716-446655440002',
  PRODUTO_BATATA: '550e8400-e29b-41d4-a716-446655440003',
  PRODUTO_REFRIGERANTE: '550e8400-e29b-41d4-a716-446655440004',
  ADICIONAL_QUEIJO: '550e8400-e29b-41d4-a716-446655440005',
  ADICIONAL_BACON: '550e8400-e29b-41d4-a716-446655440006',
  ADICIONAL_MOLHO: '550e8400-e29b-41d4-a716-446655440007',
  PEDIDO_1: '550e8400-e29b-41d4-a716-446655440008',
  PEDIDO_2: '550e8400-e29b-41d4-a716-446655440009',
} as const;

// Exemplos básicos de pedidos
export const PEDIDO_EXEMPLOS: PedidoExample[] = [
  {
    name: 'Pedido Simples',
    description: 'Pedido com um produto sem adicionais',
    data: {
      mesaId: EXAMPLE_UUIDS.MESA_1,
      status: StatusPedido.ABERTO,
      produtos: [
        {
          produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
          quantidade: 2,
          obs: 'Sem cebola, por favor',
          cupom_fiscal: true,
        },
      ],
    },
  },
  {
    name: 'Pedido Completo',
    description: 'Pedido com múltiplos produtos e adicionais',
    data: {
      mesaId: EXAMPLE_UUIDS.MESA_1,
      status: StatusPedido.ABERTO,
      pdvCodPedido: 'PED123456',
      produtos: [
        {
          produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
          quantidade: 1,
          obs: 'Bem passado',
          cupom_fiscal: true,
          adicionais: [
            {
              id: EXAMPLE_UUIDS.ADICIONAL_QUEIJO,
              quantidade: 2,
              price: 5.5,
            },
            {
              id: EXAMPLE_UUIDS.ADICIONAL_BACON,
              quantidade: 1,
              price: 8.0,
            },
          ],
        },
        {
          produtoId: EXAMPLE_UUIDS.PRODUTO_BATATA,
          quantidade: 2,
          cupom_fiscal: false,
        },
        {
          produtoId: EXAMPLE_UUIDS.PRODUTO_REFRIGERANTE,
          quantidade: 1,
          adicionais: [
            {
              id: EXAMPLE_UUIDS.ADICIONAL_MOLHO,
              quantidade: 1,
              price: 2.0,
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Pedido Cancelado',
    description: 'Pedido com status cancelado e motivo',
    data: {
      mesaId: EXAMPLE_UUIDS.MESA_2,
      status: StatusPedido.CANCELADO,
      motivoCancelamento: 'Cliente solicitou cancelamento',
      produtos: [
        {
          produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
          quantidade: 1,
          status: StatusProduto.CANCELADO,
        },
      ],
    },
  },
  {
    name: 'Pedido com Integração',
    description: 'Pedido com IDs externos para integração',
    data: {
      mesaId: EXAMPLE_UUIDS.MESA_1,
      status: StatusPedido.ABERTO,
      produtos: [
        {
          produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
          externoId: 'PROD_001',
          quantidade: 1,
          adicionais: [
            {
              id: EXAMPLE_UUIDS.ADICIONAL_QUEIJO,
              codIntegra: 'ADD_001',
              quantidade: 1,
              price: 5.5,
            },
          ],
        },
      ],
    },
  },
];

// Exemplos de atualização de pedidos
export const UPDATE_PEDIDO_EXEMPLOS: UpdatePedidoExample[] = [
  {
    name: 'Atualização Simples',
    description: 'Atualizar apenas o status do pedido',
    data: {
      id: EXAMPLE_UUIDS.PEDIDO_1,
      status: StatusPedido.FINALIZADO,
    },
  },
  {
    name: 'Atualização Completa',
    description: 'Atualizar pedido com novos produtos',
    data: {
      id: EXAMPLE_UUIDS.PEDIDO_1,
      status: StatusPedido.FINALIZADO,
      pdvCodPedido: 'PED123456',
      produtos: [
        {
          produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
          quantidade: 2,
          status: StatusProduto.PRONTO,
          adicionais: [
            {
              id: EXAMPLE_UUIDS.ADICIONAL_QUEIJO,
              quantidade: 1,
              price: 5.5,
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Cancelamento',
    description: 'Cancelar pedido com motivo',
    data: {
      id: EXAMPLE_UUIDS.PEDIDO_2,
      status: StatusPedido.CANCELADO,
      motivoCancelamento: 'Cliente solicitou cancelamento',
    },
  },
  {
    name: 'Atualização de Produtos',
    description: 'Atualizar apenas os produtos do pedido',
    data: {
      id: EXAMPLE_UUIDS.PEDIDO_1,
      produtos: [
        {
          produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
          quantidade: 3,
          status: StatusProduto.PREPARANDO,
          obs: 'Bem passado, sem cebola',
          adicionais: [
            {
              id: EXAMPLE_UUIDS.ADICIONAL_BACON,
              quantidade: 2,
              price: 8.0,
            },
          ],
        },
      ],
    },
  },
];

// Exemplos de resposta para GET /pedidos (listar todos)
export const EXEMPLOS_RESPOSTA_GET_ALL = {
  PEDIDOS_PAGINADOS: {
    data: [
      {
        id: EXAMPLE_UUIDS.PEDIDO_1,
        status: StatusPedido.ABERTO,
        pdvCodPedido: 'PED123456',
        createdAt: '2024-01-15T10:30:00.000Z',
        mesa: {
          numero: 1,
          id: EXAMPLE_UUIDS.MESA_1,
        },
        produtos: [
          {
            produto: {
              nome: 'X-Burger',
              preco: 25.9,
              descricao: 'Hambúrguer artesanal',
              codigo: 'XB001',
            },
            obs: 'Sem cebola',
            adicionais: [
              {
                adicional: {
                  nome: 'Queijo Extra',
                  preco: 5.5,
                  codIntegra: 'QEX001',
                },
                quantidade: 2,
                preco: 11.0,
              },
            ],
            quantidade: 1,
            status: StatusProduto.PREPARANDO,
          },
        ],
      },
      {
        id: EXAMPLE_UUIDS.PEDIDO_2,
        status: StatusPedido.FINALIZADO,
        pdvCodPedido: 'PED123457',
        createdAt: '2024-01-15T09:15:00.000Z',
        mesa: {
          numero: 2,
          id: EXAMPLE_UUIDS.MESA_2,
        },
        produtos: [
          {
            produto: {
              nome: 'Batata Frita',
              preco: 12.9,
              descricao: 'Batata frita crocante',
              codigo: 'BF001',
            },
            obs: null,
            adicionais: [],
            quantidade: 2,
            status: StatusProduto.ENTREGUE,
          },
        ],
      },
    ],
    total: 2,
    page: 1,
    limit: 10,
  },
  PEDIDOS_VAZIOS: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  },
} as const;

// Exemplos de resposta para GET /pedidos/:id (buscar por ID)
export const EXEMPLOS_RESPOSTA_GET_ONE = {
  PEDIDO_ENCONTRADO: {
    id: EXAMPLE_UUIDS.PEDIDO_1,
    status: StatusPedido.ABERTO,
    pdvCodPedido: 'PED123456',
    createdAt: '2024-01-15T10:30:00.000Z',
    mesa: {
      numero: 1,
      id: EXAMPLE_UUIDS.MESA_1,
    },
    produtos: [
      {
        produto: {
          nome: 'X-Burger',
          preco: 25.9,
          descricao: 'Hambúrguer artesanal com queijo, bacon e molho especial',
          codigo: 'XB001',
        },
        obs: 'Sem cebola, por favor',
        adicionais: [
          {
            adicional: {
              nome: 'Queijo Extra',
              preco: 5.5,
              codIntegra: 'QEX001',
            },
            quantidade: 2,
            preco: 11.0,
          },
          {
            adicional: {
              nome: 'Bacon Extra',
              preco: 8.0,
              codIntegra: 'BEX001',
            },
            quantidade: 1,
            preco: 8.0,
          },
        ],
        quantidade: 1,
        status: StatusProduto.PREPARANDO,
      },
      {
        produto: {
          nome: 'Batata Frita',
          preco: 12.9,
          descricao: 'Batata frita crocante',
          codigo: 'BF001',
        },
        obs: null,
        adicionais: [],
        quantidade: 2,
        status: StatusProduto.AGUARDANDO,
      },
    ],
  },
  PEDIDO_CANCELADO: {
    id: EXAMPLE_UUIDS.PEDIDO_2,
    status: StatusPedido.CANCELADO,
    pdvCodPedido: 'PED123457',
    createdAt: '2024-01-15T09:15:00.000Z',
    mesa: {
      numero: 2,
      id: EXAMPLE_UUIDS.MESA_2,
    },
    produtos: [
      {
        produto: {
          nome: 'X-Burger',
          preco: 25.9,
          descricao: 'Hambúrguer artesanal',
          codigo: 'XB001',
        },
        obs: null,
        adicionais: [],
        quantidade: 1,
        status: StatusProduto.CANCELADO,
      },
    ],
  },
} as const;

// Exemplos de resposta para GET /pedidos/mesa/:id (buscar por mesa)
export const EXEMPLOS_RESPOSTA_GET_BY_MESA = {
  PEDIDOS_MESA_ABERTOS: {
    data: [
      {
        id: EXAMPLE_UUIDS.PEDIDO_1,
        status: StatusPedido.ABERTO,
        pdvCodPedido: 'PED123456',
        createdAt: '2024-01-15T10:30:00.000Z',
        mesa: {
          numero: 1,
          id: EXAMPLE_UUIDS.MESA_1,
        },
        produtos: [
          {
            produto: {
              nome: 'X-Burger',
              preco: 25.9,
              descricao: 'Hambúrguer artesanal',
              codigo: 'XB001',
            },
            obs: 'Sem cebola',
            adicionais: [
              {
                adicional: {
                  nome: 'Queijo Extra',
                  preco: 5.5,
                  codIntegra: 'QEX001',
                },
                quantidade: 1,
                preco: 5.5,
              },
            ],
            quantidade: 1,
            status: StatusProduto.PREPARANDO,
          },
        ],
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
  },
  PEDIDOS_MESA_FINALIZADOS: {
    data: [
      {
        id: EXAMPLE_UUIDS.PEDIDO_2,
        status: StatusPedido.FINALIZADO,
        pdvCodPedido: 'PED123457',
        createdAt: '2024-01-15T09:15:00.000Z',
        mesa: {
          numero: 1,
          id: EXAMPLE_UUIDS.MESA_1,
        },
        produtos: [
          {
            produto: {
              nome: 'Batata Frita',
              preco: 12.9,
              descricao: 'Batata frita crocante',
              codigo: 'BF001',
            },
            obs: null,
            adicionais: [],
            quantidade: 2,
            status: StatusProduto.ENTREGUE,
          },
        ],
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
  },
  PEDIDOS_MESA_VAZIOS: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  },
} as const;

// Exemplos de validação de erro
export const EXEMPLOS_ERRO = {
  MESA_INVALIDA: {
    mesaId: 'invalid-uuid',
    produtos: [
      {
        produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
        quantidade: 1,
      },
    ],
  },
  PRODUTO_QUANTIDADE_INVALIDA: {
    mesaId: EXAMPLE_UUIDS.MESA_1,
    produtos: [
      {
        produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
        quantidade: -1,
      },
    ],
  },
  ADICIONAL_PRECO_INVALIDO: {
    mesaId: EXAMPLE_UUIDS.MESA_1,
    produtos: [
      {
        produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
        quantidade: 1,
        adicionais: [
          {
            id: EXAMPLE_UUIDS.ADICIONAL_QUEIJO,
            quantidade: 1,
            price: -5.5,
          },
        ],
      },
    ],
  },
  PRODUTOS_VAZIO: {
    mesaId: EXAMPLE_UUIDS.MESA_1,
    produtos: [],
  },
  PRODUTO_ID_INVALIDO: {
    mesaId: EXAMPLE_UUIDS.MESA_1,
    produtos: [
      {
        produtoId: 'invalid-uuid',
        quantidade: 1,
      },
    ],
  },
} as const;

// Exemplos de erro para atualização
export const EXEMPLOS_ERRO_UPDATE = {
  PEDIDO_ID_INVALIDO: {
    id: 'invalid-uuid',
    status: StatusPedido.FINALIZADO,
  },
  STATUS_INVALIDO: {
    id: EXAMPLE_UUIDS.PEDIDO_1,
    status: 'INVALID_STATUS',
  },
  PRODUTO_UPDATE_INVALIDO: {
    id: EXAMPLE_UUIDS.PEDIDO_1,
    produtos: [
      {
        produtoId: 'invalid-uuid',
        quantidade: 1,
      },
    ],
  },
  ADICIONAL_UPDATE_INVALIDO: {
    id: EXAMPLE_UUIDS.PEDIDO_1,
    produtos: [
      {
        produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
        quantidade: 1,
        adicionais: [
          {
            id: 'invalid-uuid',
            quantidade: 1,
            price: 5.5,
          },
        ],
      },
    ],
  },
} as const;

// Exemplos de resposta de sucesso
export const EXEMPLOS_RESPOSTA = {
  PEDIDO_CRIADO: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    mesaId: EXAMPLE_UUIDS.MESA_1,
    status: StatusPedido.ABERTO,
    pdvCodPedido: 'PED123456',
    restaurantCnpj: '12345678000199',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  PEDIDO_CANCELADO: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    mesaId: EXAMPLE_UUIDS.MESA_2,
    status: StatusPedido.CANCELADO,
    motivoCancelamento: 'Cliente solicitou cancelamento',
    restaurantCnpj: '12345678000199',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  PEDIDO_ATUALIZADO: {
    id: EXAMPLE_UUIDS.PEDIDO_1,
    mesaId: EXAMPLE_UUIDS.MESA_1,
    status: StatusPedido.FINALIZADO,
    pdvCodPedido: 'PED123456',
    restaurantCnpj: '12345678000199',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T11:45:00.000Z',
    updatedFields: ['status', 'pdvCodPedido'],
  },
} as const;

// Exemplos de erro de validação
export const EXEMPLOS_ERRO_VALIDACAO = {
  CAMPOS_OBRIGATORIOS: {
    statusCode: 400,
    message: [
      'mesaId should not be empty',
      'produtos should not be empty',
      'produtos.0.produtoId should not be empty',
    ],
    error: 'Bad Request',
  },
  UUID_INVALIDO: {
    statusCode: 400,
    message: ['mesaId must be a UUID', 'produtos.0.produtoId must be a UUID'],
    error: 'Bad Request',
  },
  QUANTIDADE_INVALIDA: {
    statusCode: 400,
    message: [
      'produtos.0.quantidade should be greater than 0',
      'produtos.0.adicionais.0.quantidade should be greater than 0',
    ],
    error: 'Bad Request',
  },
  PRECO_INVALIDO: {
    statusCode: 400,
    message: [
      'produtos.0.adicionais.0.price should be greater than or equal to 0',
    ],
    error: 'Bad Request',
  },
} as const;

// Exemplos de erro de validação para atualização
export const EXEMPLOS_ERRO_VALIDACAO_UPDATE = {
  PEDIDO_ID_OBRIGATORIO: {
    statusCode: 400,
    message: ['id should not be empty'],
    error: 'Bad Request',
  },
  PEDIDO_ID_UUID_INVALIDO: {
    statusCode: 400,
    message: ['id must be a UUID'],
    error: 'Bad Request',
  },
  STATUS_INVALIDO: {
    statusCode: 400,
    message: ['status must be a valid enum value'],
    error: 'Bad Request',
  },
  PRODUTO_UPDATE_INVALIDO: {
    statusCode: 400,
    message: [
      'produtos.0.produtoId must be a UUID',
      'produtos.0.quantidade should be greater than 0',
    ],
    error: 'Bad Request',
  },
} as const;

// Exemplos de configuração
export const EXEMPLOS_CONFIGURACAO = {
  VALIDACAO_STRICTA: {
    strictMode: true,
    allowEmptyProducts: false,
    validatePrices: true,
    validateQuantities: true,
  },
  VALIDACAO_FLEXIVEL: {
    strictMode: false,
    allowEmptyProducts: true,
    validatePrices: false,
    validateQuantities: true,
  },
} as const;

// Função para gerar exemplo dinâmico
export function gerarExemploPedido(config: {
  incluirAdicionais?: boolean;
  incluirObservacoes?: boolean;
  incluirPdvCode?: boolean;
  multiplosProdutos?: boolean;
}): CreatePedidosDto {
  const exemplo: CreatePedidosDto = {
    mesaId: EXAMPLE_UUIDS.MESA_1,
    status: StatusPedido.ABERTO,
    produtos: [
      {
        produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
        quantidade: 1,
        cupom_fiscal: true,
      },
    ],
  };

  if (config.incluirPdvCode) {
    exemplo.pdvCodPedido = 'PED123456';
  }

  if (config.incluirObservacoes) {
    exemplo.produtos[0].obs = 'Sem cebola, por favor';
  }

  if (config.incluirAdicionais) {
    exemplo.produtos[0].adicionais = [
      {
        id: EXAMPLE_UUIDS.ADICIONAL_QUEIJO,
        quantidade: 1,
        price: 5.5,
      },
    ];
  }

  if (config.multiplosProdutos) {
    exemplo.produtos.push({
      produtoId: EXAMPLE_UUIDS.PRODUTO_BATATA,
      quantidade: 2,
      cupom_fiscal: false,
    });
  }

  return exemplo;
}

// Função para gerar exemplo de atualização dinâmico
export function gerarExemploUpdatePedido(config: {
  incluirStatus?: boolean;
  incluirProdutos?: boolean;
  incluirMotivo?: boolean;
  incluirPdvCode?: boolean;
}): UpdatePedidosDto {
  const exemplo: UpdatePedidosDto = {
    id: EXAMPLE_UUIDS.PEDIDO_1,
  };

  if (config.incluirStatus) {
    exemplo.status = StatusPedido.FINALIZADO;
  }

  if (config.incluirPdvCode) {
    exemplo.pdvCodPedido = 'PED123456';
  }

  if (config.incluirMotivo) {
    exemplo.motivoCancelamento = 'Cliente solicitou cancelamento';
  }

  if (config.incluirProdutos) {
    exemplo.produtos = [
      {
        produtoId: EXAMPLE_UUIDS.PRODUTO_HAMBURGUER,
        quantidade: 2,
        status: StatusProduto.PRONTO,
        adicionais: [
          {
            id: EXAMPLE_UUIDS.ADICIONAL_QUEIJO,
            quantidade: 1,
            price: 5.5,
          },
        ],
      },
    ];
  }

  return exemplo;
}

// Função para validar exemplo
export function validarExemploPedido(pedido: CreatePedidosDto): {
  valido: boolean;
  erros: string[];
} {
  const erros: string[] = [];

  if (!pedido.mesaId) {
    erros.push('mesaId é obrigatório');
  }

  if (!pedido.produtos || pedido.produtos.length === 0) {
    erros.push('produtos é obrigatório e não pode estar vazio');
  }

  pedido.produtos?.forEach((produto, index) => {
    if (!produto.produtoId) {
      erros.push(`produtos[${index}].produtoId é obrigatório`);
    }
    if (!produto.quantidade || produto.quantidade <= 0) {
      erros.push(`produtos[${index}].quantidade deve ser maior que zero`);
    }
  });

  return {
    valido: erros.length === 0,
    erros,
  };
}

// Função para validar exemplo de atualização
export function validarExemploUpdatePedido(pedido: UpdatePedidosDto): {
  valido: boolean;
  erros: string[];
} {
  const erros: string[] = [];

  if (!pedido.id) {
    erros.push('id é obrigatório');
  }

  if (pedido.produtos && pedido.produtos.length > 0) {
    pedido.produtos.forEach((produto, index) => {
      if (!produto.produtoId) {
        erros.push(`produtos[${index}].produtoId é obrigatório`);
      }
      if (!produto.quantidade || produto.quantidade <= 0) {
        erros.push(`produtos[${index}].quantidade deve ser maior que zero`);
      }
    });
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}
