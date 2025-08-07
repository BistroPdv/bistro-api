/**
 * Índice de DTOs e tipos de pedidos
 * Este arquivo centraliza todas as exportações relacionadas aos DTOs de pedidos
 */

// DTOs principais
export {
  CreatePedidosDto,
  StatusPedido,
  StatusProduto,
} from './create-pedidos.dto';
export {
  UpdateAdicionalDto,
  UpdatePedidosDto,
  UpdateProdutoPedidoDto,
} from './update-pedidos.dto';

// Constantes e configurações
export {
  PEDIDOS_DEFAULTS,
  PEDIDOS_ERROR_MESSAGES,
  PEDIDOS_LIMITS,
  PEDIDOS_VALIDATION_CONFIG,
  STATUS_PEDIDO_VALIDOS,
  STATUS_PRODUTO_VALIDOS,
} from './pedidos.constants';

// Tipos e interfaces
export {
  AdicionalId,
  AdicionalPedido,
  AdicionalValidation,
  CreatePedidoResponse,
  CreateResponse,
  Documentation,
  DtoDocumentation,
  ExampleConfig,
  FieldDocumentation,
  MesaId,
  MesaValidation,
  PedidoCompleto,
  PedidoExample,
  PedidoId,
  PedidoProcessingResult,
  PedidoStats,
  PedidoStatus,
  PedidoValidationConfig,
  PedidoValidationContext,
  PedidoValidationError,
  PedidoValidationResult,
  ProcessingResult,
  ProdutoId,
  ProdutoPedido,
  ProdutoStatus,
  ProdutoValidation,
  UpdateAdicionalPedido,
  UpdatePedidoCompleto,
  UpdatePedidoExample,
  UpdatePedidoProcessingResult,
  UpdatePedidoResponse,
  UpdateProcessingResult,
  UpdateProdutoPedido,
  UpdateResponse,
  ValidationConfig,
  ValidationContext,
  ValidationError,
  ValidationResult,
} from './pedidos.types';

// Exemplos
export {
  EXAMPLE_UUIDS,
  EXEMPLOS_CONFIGURACAO,
  EXEMPLOS_ERRO,
  EXEMPLOS_ERRO_UPDATE,
  EXEMPLOS_ERRO_VALIDACAO,
  EXEMPLOS_ERRO_VALIDACAO_UPDATE,
  EXEMPLOS_RESPOSTA,
  EXEMPLOS_RESPOSTA_GET_ALL,
  EXEMPLOS_RESPOSTA_GET_BY_MESA,
  EXEMPLOS_RESPOSTA_GET_ONE,
  gerarExemploPedido,
  gerarExemploUpdatePedido,
  PEDIDO_EXEMPLOS,
  UPDATE_PEDIDO_EXEMPLOS,
  validarExemploPedido,
  validarExemploUpdatePedido,
} from './pedidos.examples';

// Re-exportações para facilitar importação
export type { PedidosErrorMessages, PedidosLimits } from './pedidos.constants';

// Exportações para uso em outros módulos
export const PEDIDOS_DTO_EXPORTS = {
  // DTOs
  CreatePedidosDto: 'CreatePedidosDto',
  UpdatePedidosDto: 'UpdatePedidosDto',
  StatusPedido: 'StatusPedido',
  StatusProduto: 'StatusProduto',

  // Constantes
  PEDIDOS_LIMITS: 'PEDIDOS_LIMITS',
  PEDIDOS_ERROR_MESSAGES: 'PEDIDOS_ERROR_MESSAGES',
  PEDIDOS_DEFAULTS: 'PEDIDOS_DEFAULTS',

  // Tipos
  CreatePedidoResponse: 'CreatePedidoResponse',
  UpdatePedidoResponse: 'UpdatePedidoResponse',
  PedidoCompleto: 'PedidoCompleto',
  PedidoValidationResult: 'PedidoValidationResult',

  // Exemplos
  PEDIDO_EXEMPLOS: 'PEDIDO_EXEMPLOS',
  UPDATE_PEDIDO_EXEMPLOS: 'UPDATE_PEDIDO_EXEMPLOS',
  EXEMPLOS_RESPOSTA_GET_ALL: 'EXEMPLOS_RESPOSTA_GET_ALL',
  EXEMPLOS_RESPOSTA_GET_ONE: 'EXEMPLOS_RESPOSTA_GET_ONE',
  EXEMPLOS_RESPOSTA_GET_BY_MESA: 'EXEMPLOS_RESPOSTA_GET_BY_MESA',
  EXEMPLOS_ERRO: 'EXEMPLOS_ERRO',
  gerarExemploPedido: 'gerarExemploPedido',
  gerarExemploUpdatePedido: 'gerarExemploUpdatePedido',
} as const;

// Configuração de documentação
export const PEDIDOS_DOCUMENTATION_CONFIG = {
  moduleName: 'Pedidos',
  description: 'Módulo responsável por gerenciar pedidos do sistema',
  version: '1.0.0',
  author: 'Bistro API Team',
  lastUpdated: '2024-01-15',
  criticalRoutes: ['POST /pedidos', 'PUT /pedidos/:id'],
  validationRules: [
    'Todos os campos obrigatórios devem ser preenchidos',
    'UUIDs devem ser válidos',
    'Quantidades devem ser positivas',
    'Preços devem ser não negativos',
    'Arrays não podem estar vazios',
    'ID do pedido é obrigatório para atualização',
  ],
} as const;
