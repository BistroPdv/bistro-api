/**
 * Tipos e interfaces relacionados aos pedidos
 * Este arquivo contém todas as interfaces e tipos utilizados nos DTOs de pedidos
 */

import { StatusPedido, StatusProduto } from './create-pedidos.dto';

// Interface para resposta de criação de pedido
export interface CreatePedidoResponse {
  id: string;
  mesaId: string;
  status: StatusPedido;
  pdvCodPedido?: string;
  motivoCancelamento?: string;
  restaurantCnpj: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para resposta de atualização de pedido
export interface UpdatePedidoResponse {
  id: string;
  mesaId: string;
  status: StatusPedido;
  pdvCodPedido?: string;
  motivoCancelamento?: string;
  restaurantCnpj: string;
  createdAt: string;
  updatedAt: string;
  updatedFields: string[];
}

// Interface para produto do pedido
export interface ProdutoPedido {
  produtoId: string;
  externoId?: string;
  obs?: string;
  status?: StatusProduto;
  quantidade: number;
  cupom_fiscal?: boolean;
  adicionais?: AdicionalPedido[];
}

// Interface para produto atualizado do pedido
export interface UpdateProdutoPedido {
  produtoId: string;
  externoId?: string;
  obs?: string;
  status?: StatusProduto;
  quantidade: number;
  cupom_fiscal?: boolean;
  adicionais?: UpdateAdicionalPedido[];
}

// Interface para adicional do pedido
export interface AdicionalPedido {
  id: string;
  codIntegra?: string;
  quantidade: number;
  price: number;
}

// Interface para adicional atualizado do pedido
export interface UpdateAdicionalPedido {
  id: string;
  codIntegra?: string;
  quantidade: number;
  price: number;
}

// Interface para pedido completo
export interface PedidoCompleto {
  mesaId: string;
  status?: StatusPedido;
  pdvCodPedido?: string;
  motivoCancelamento?: string;
  produtos: ProdutoPedido[];
}

// Interface para pedido atualizado
export interface UpdatePedidoCompleto {
  id: string;
  status?: StatusPedido;
  pdvCodPedido?: string;
  motivoCancelamento?: string;
  produtos?: UpdateProdutoPedido[];
}

// Interface para validação de negócio
export interface PedidoValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Interface para resposta de erro de validação
export interface PedidoValidationError {
  field: string;
  message: string;
  value?: any;
  constraint?: string;
}

// Interface para exemplo de pedido
export interface PedidoExample {
  name: string;
  description: string;
  data: PedidoCompleto;
}

// Interface para exemplo de atualização de pedido
export interface UpdatePedidoExample {
  name: string;
  description: string;
  data: UpdatePedidoCompleto;
}

// Interface para configuração de validação
export interface PedidoValidationConfig {
  strictMode: boolean;
  allowEmptyProducts: boolean;
  validatePrices: boolean;
  validateQuantities: boolean;
}

// Interface para resultado de processamento
export interface PedidoProcessingResult {
  success: boolean;
  pedidoId?: string;
  errors?: string[];
  warnings?: string[];
  processingTime?: number;
}

// Interface para resultado de atualização
export interface UpdatePedidoProcessingResult {
  success: boolean;
  pedidoId?: string;
  updatedFields?: string[];
  errors?: string[];
  warnings?: string[];
  processingTime?: number;
}

// Interface para estatísticas de pedido
export interface PedidoStats {
  totalProdutos: number;
  totalAdicionais: number;
  valorTotal: number;
  tempoEstimado: number;
}

// Interface para validação de mesa
export interface MesaValidation {
  mesaId: string;
  exists: boolean;
  belongsToRestaurant: boolean;
  isActive: boolean;
}

// Interface para validação de produto
export interface ProdutoValidation {
  produtoId: string;
  exists: boolean;
  isActive: boolean;
  hasStock: boolean;
  price: number;
}

// Interface para validação de adicional
export interface AdicionalValidation {
  adicionalId: string;
  exists: boolean;
  isActive: boolean;
  price: number;
}

// Interface para contexto de validação
export interface PedidoValidationContext {
  restaurantCnpj: string;
  userId: string;
  mesaValidation: MesaValidation;
  produtosValidation: ProdutoValidation[];
  adicionaisValidation: AdicionalValidation[];
}

// Interface para configuração de exemplo
export interface ExampleConfig {
  includeAdicionais: boolean;
  includeObservations: boolean;
  includePdvCode: boolean;
  multipleProducts: boolean;
}

// Interface para documentação de campo
export interface FieldDocumentation {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: any;
  constraints: string[];
  validationRules: string[];
}

// Interface para documentação completa do DTO
export interface DtoDocumentation {
  name: string;
  description: string;
  fields: FieldDocumentation[];
  examples: PedidoExample[];
  validationRules: string[];
  errorCodes: Record<string, string>;
}

// Tipos utilitários (aliases para facilitar uso)
export type PedidoStatus = StatusPedido;
export type ProdutoStatus = StatusProduto;
export type PedidoId = string;
export type MesaId = string;
export type ProdutoId = string;
export type AdicionalId = string;

// Tipos para validação (aliases para facilitar uso)
export type ValidationResult = PedidoValidationResult;
export type ValidationError = PedidoValidationError;
export type ValidationContext = PedidoValidationContext;

// Tipos para resposta (aliases para facilitar uso)
export type CreateResponse = CreatePedidoResponse;
export type UpdateResponse = UpdatePedidoResponse;
export type ProcessingResult = PedidoProcessingResult;
export type UpdateProcessingResult = UpdatePedidoProcessingResult;

// Tipos para configuração (aliases para facilitar uso)
export type ValidationConfig = PedidoValidationConfig;
export type Documentation = DtoDocumentation;
