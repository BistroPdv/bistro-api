/**
 * Constantes e tipos relacionados aos pedidos
 * Este arquivo contém todas as constantes, limites e tipos utilizados nos DTOs de pedidos
 */

// Limites de validação
export const PEDIDOS_LIMITS = {
  // Produtos
  MAX_PRODUTOS_POR_PEDIDO: 50,
  MIN_QUANTIDADE_PRODUTO: 1,
  MAX_QUANTIDADE_PRODUTO: 999,

  // Adicionais
  MAX_ADICIONAIS_POR_PRODUTO: 20,
  MIN_QUANTIDADE_ADICIONAL: 1,
  MAX_QUANTIDADE_ADICIONAL: 99,

  // Preços
  MIN_PRECO: 0,
  MAX_PRECO: 999999.99,

  // Strings
  MAX_LENGTH_EXTERNO_ID: 255,
  MAX_LENGTH_OBSERVACAO: 1000,
  MAX_LENGTH_PDV_CODIGO: 255,
  MAX_LENGTH_MOTIVO_CANCELAMENTO: 500,
  MAX_LENGTH_CODIGO_INTEGRACAO: 255,

  // UUID
  UUID_LENGTH: 36,
} as const;

// Mensagens de erro padronizadas
export const PEDIDOS_ERROR_MESSAGES = {
  // Validações gerais
  MESA_ID_OBRIGATORIO: 'ID da mesa é obrigatório',
  MESA_ID_UUID_INVALIDO: 'ID da mesa deve ser um UUID válido',
  PRODUTOS_OBRIGATORIO: 'Lista de produtos é obrigatória',
  PRODUTOS_ARRAY: 'Produtos deve ser um array',
  PRODUTO_VALIDO: 'Cada produto deve ser válido',

  // Validações de produto
  PRODUTO_ID_OBRIGATORIO: 'ID do produto é obrigatório',
  PRODUTO_ID_UUID_INVALIDO: 'ID do produto deve ser um UUID válido',
  QUANTIDADE_PRODUTO_OBRIGATORIA: 'Quantidade do produto é obrigatória',
  QUANTIDADE_PRODUTO_NUMERO: 'Quantidade deve ser um número',
  QUANTIDADE_PRODUTO_POSITIVA: 'Quantidade deve ser maior que zero',
  QUANTIDADE_PRODUTO_MIN: 'Quantidade deve ser no mínimo 1',
  QUANTIDADE_PRODUTO_MAX: 'Quantidade deve ser no máximo 999',
  CUPOM_FISCAL_BOOLEAN: 'Cupom fiscal deve ser um boolean',

  // Validações de adicional
  ADICIONAL_ID_OBRIGATORIO: 'ID do adicional é obrigatório',
  ADICIONAL_ID_UUID_INVALIDO: 'ID do adicional deve ser um UUID válido',
  QUANTIDADE_ADICIONAL_OBRIGATORIA: 'Quantidade do adicional é obrigatória',
  QUANTIDADE_ADICIONAL_NUMERO: 'Quantidade deve ser um número',
  QUANTIDADE_ADICIONAL_POSITIVA: 'Quantidade deve ser maior que zero',
  QUANTIDADE_ADICIONAL_MIN: 'Quantidade deve ser no mínimo 1',
  QUANTIDADE_ADICIONAL_MAX: 'Quantidade deve ser no máximo 99',
  PRECO_ADICIONAL_OBRIGATORIO: 'Preço do adicional é obrigatório',
  PRECO_ADICIONAL_NUMERO: 'Preço deve ser um número',
  PRECO_ADICIONAL_MIN: 'Preço deve ser maior ou igual a zero',
  PRECO_ADICIONAL_MAX: 'Preço deve ser no máximo 999999.99',

  // Validações de string
  EXTERNO_ID_STRING: 'ID externo deve ser uma string',
  EXTERNO_ID_MAX: 'ID externo deve ter no máximo 255 caracteres',
  OBS_STRING: 'Observações devem ser uma string',
  OBS_MAX: 'Observações devem ter no máximo 1000 caracteres',
  PDV_CODIGO_STRING: 'Código PDV deve ser uma string',
  PDV_CODIGO_MAX: 'Código PDV deve ter no máximo 255 caracteres',
  MOTIVO_STRING: 'Motivo do cancelamento deve ser uma string',
  MOTIVO_MAX: 'Motivo do cancelamento deve ter no máximo 500 caracteres',
  CODIGO_INTEGRACAO_STRING: 'Código de integração deve ser uma string',
  CODIGO_INTEGRACAO_MAX:
    'Código de integração deve ter no máximo 255 caracteres',

  // Validações de enum
  STATUS_PEDIDO_VALIDO: 'Status deve ser um dos valores válidos',
  STATUS_PRODUTO_VALIDO: 'Status deve ser um dos valores válidos',

  // Validações de array
  ADICIONAIS_ARRAY: 'Adicionais deve ser um array',
  ADICIONAIS_VALIDO: 'Cada adicional deve ser válido',
} as const;

// Tipos de validação
export type PedidosLimits = typeof PEDIDOS_LIMITS;
export type PedidosErrorMessages = typeof PEDIDOS_ERROR_MESSAGES;

// Status válidos
export const STATUS_PEDIDO_VALIDOS = [
  'ABERTO',
  'FINALIZADO',
  'CANCELADO',
] as const;
export const STATUS_PRODUTO_VALIDOS = [
  'AGUARDANDO',
  'PREPARANDO',
  'CANCELADO',
  'PRONTO',
  'ENTREGUE',
] as const;

// Valores padrão
export const PEDIDOS_DEFAULTS = {
  STATUS_PEDIDO: 'ABERTO',
  STATUS_PRODUTO: 'AGUARDANDO',
  CUPOM_FISCAL: true,
  QUANTIDADE_MINIMA: 1,
  PRECO_MINIMO: 0,
} as const;

// Configurações de validação
export const PEDIDOS_VALIDATION_CONFIG = {
  UUID_VERSION: '4',
  DECIMAL_PLACES: 2,
  TIMESTAMP_FORMAT: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;
