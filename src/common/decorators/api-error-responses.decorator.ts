import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
} from '../dto/error-response.dto';

/**
 * Interface para configuração dos decorators de erro
 */
interface ApiErrorConfig {
  resourceName?: string;
  resourceNamePlural?: string;
  basePath?: string;
}

/**
 * Decorator para documentar respostas de erro padronizadas no Swagger
 */
export function ApiErrorResponses(config: ApiErrorConfig = {}) {
  const {
    resourceName = 'Recurso',
    resourceNamePlural = 'Recursos',
    basePath = '/',
  } = config;

  return applyDecorators(
    // Erro 400 - Validação
    ApiResponse({
      status: 400,
      description: 'Dados inválidos fornecidos',
      type: ValidationErrorResponseDto,
      schema: {
        example: {
          statusCode: 400,
          message: 'Dados inválidos fornecidos',
          errorCode: 'VALIDATION_ERROR',
          details: [
            'O campo nome é obrigatório',
            'O email deve ter formato válido',
          ],
          timestamp: '2024-01-15T10:30:00.000Z',
          path: `${basePath}/${resourceNamePlural.toLowerCase()}`,
          method: 'POST',
          errorId: 'err_1705312200000_abc123def',
        },
      },
    }),

    // Erro 401 - Não autorizado
    ApiResponse({
      status: 401,
      description: 'Não autorizado',
      type: ErrorResponseDto,
      schema: {
        example: {
          statusCode: 401,
          message: 'Token de acesso inválido ou expirado',
          errorCode: 'UNAUTHORIZED',
          timestamp: '2024-01-15T10:30:00.000Z',
          path: `${basePath}/${resourceNamePlural.toLowerCase()}`,
          method: 'GET',
          errorId: 'err_1705312200000_xyz789ghi',
        },
      },
    }),

    // Erro 403 - Acesso negado
    // ApiResponse({
    //   status: 403,
    //   description: 'Acesso negado',
    //   type: ErrorResponseDto,
    //   schema: {
    //     example: {
    //       statusCode: 403,
    //       message: 'Você não tem permissão para esta operação',
    //       errorCode: 'FORBIDDEN',
    //       timestamp: '2024-01-15T10:30:00.000Z',
    //       path: `${basePath}/${resourceNamePlural.toLowerCase()}`,
    //       method: 'POST',
    //       errorId: 'err_1705312200000_def456jkl',
    //     },
    //   },
    // }),

    // Erro 404 - Não encontrado
    ApiResponse({
      status: 404,
      description: 'Recurso não encontrado',
      type: ErrorResponseDto,
      schema: {
        example: {
          statusCode: 404,
          message: `${resourceName} não encontrado`,
          errorCode: 'NOT_FOUND',
          timestamp: '2024-01-15T10:30:00.000Z',
          path: `${basePath}/${resourceNamePlural.toLowerCase()}/123`,
          method: 'GET',
          errorId: 'err_1705312200000_mno789pqr',
        },
      },
    }),

    // Erro 409 - Conflito
    // ApiResponse({
    //   status: 409,
    //   description: 'Conflito - Recurso já existe',
    //   type: ErrorResponseDto,
    //   schema: {
    //     example: {
    //       statusCode: 409,
    //       message: `${resourceName} com nome já existe`,
    //       errorCode: 'ALREADY_EXISTS',
    //       timestamp: '2024-01-15T10:30:00.000Z',
    //       path: `${basePath}/${resourceNamePlural.toLowerCase()}`,
    //       method: 'POST',
    //       errorId: 'err_1705312200000_stu012vwx',
    //     },
    //   },
    // }),

    // Erro 500 - Erro interno
    ApiResponse({
      status: 500,
      description: 'Erro interno do servidor',
      type: ErrorResponseDto,
      schema: {
        example: {
          statusCode: 500,
          message: 'Erro interno do servidor',
          errorCode: 'INTERNAL_ERROR',
          timestamp: '2024-01-15T10:30:00.000Z',
          path: `${basePath}/${resourceNamePlural.toLowerCase()}`,
          method: 'GET',
          errorId: 'err_1705312200000_yz345abc',
        },
      },
    }),

    // Erro 502 - Serviço externo
    // ApiResponse({
    //   status: 502,
    //   description: 'Erro em serviço externo',
    //   type: ErrorResponseDto,
    //   schema: {
    //     example: {
    //       statusCode: 502,
    //       message: 'Erro no serviço externo: API de pagamento',
    //       errorCode: 'EXTERNAL_SERVICE_ERROR',
    //       timestamp: '2024-01-15T10:30:00.000Z',
    //       path: `${basePath}/${resourceNamePlural.toLowerCase()}`,
    //       method: 'POST',
    //       errorId: 'err_1705312200000_def678ghi',
    //     },
    //   },
    // }),
  );
}

/**
 * Decorator para operações de criação (POST)
 */
export function ApiCreateErrorResponses(config: ApiErrorConfig = {}) {
  const { resourceName = 'Recurso' } = config;

  return applyDecorators(
    ApiErrorResponses(config),
    // Resposta de sucesso específica para criação
    ApiResponse({
      status: 201,
      description: `${resourceName} criado com sucesso`,
    }),
  );
}

/**
 * Decorator para operações de atualização (PUT/PATCH)
 */
export function ApiUpdateErrorResponses(config: ApiErrorConfig = {}) {
  const { resourceName = 'Recurso' } = config;

  return applyDecorators(
    ApiErrorResponses(config),
    // Resposta de sucesso específica para atualização
    ApiResponse({
      status: 200,
      description: `${resourceName} atualizado com sucesso`,
    }),
  );
}

/**
 * Decorator para operações de busca (GET)
 */
export function ApiFindErrorResponses(config: ApiErrorConfig = {}) {
  const { resourceName = 'Recurso', resourceNamePlural = 'Recursos' } = config;

  return applyDecorators(
    ApiErrorResponses(config),
    // Resposta de sucesso específica para busca
    ApiResponse({
      status: 200,
      description: `${resourceNamePlural} encontrados com sucesso`,
    }),
  );
}

/**
 * Decorator para operações de exclusão (DELETE)
 */
export function ApiDeleteErrorResponses(config: ApiErrorConfig = {}) {
  const { resourceName = 'Recurso' } = config;

  return applyDecorators(
    ApiErrorResponses(config),
    // Resposta de sucesso específica para exclusão
    ApiResponse({
      status: 200,
      description: `${resourceName} excluído com sucesso`,
    }),
  );
}

/**
 * Decorator para operações de listagem (GET com paginação)
 */
export function ApiListErrorResponses(config: ApiErrorConfig = {}) {
  const { resourceNamePlural = 'Recursos' } = config;

  return applyDecorators(
    ApiErrorResponses(config),
    // Resposta de sucesso específica para listagem
    ApiResponse({
      status: 200,
      description: `Lista de ${resourceNamePlural.toLowerCase()} retornada com sucesso`,
    }),
  );
}

/**
 * Decorator para operações de busca por ID (GET /:id)
 */
export function ApiFindByIdErrorResponses(config: ApiErrorConfig = {}) {
  const { resourceName = 'Recurso' } = config;

  return applyDecorators(
    ApiErrorResponses(config),
    // Resposta de sucesso específica para busca por ID
    ApiResponse({
      status: 200,
      description: `${resourceName} encontrado com sucesso`,
    }),
  );
}

/**
 * Decorator para operações de atualização de ordem (PUT /ordem)
 */
export function ApiUpdateOrderErrorResponses(config: ApiErrorConfig = {}) {
  const { resourceNamePlural = 'Recursos' } = config;

  return applyDecorators(
    ApiErrorResponses(config),
    // Resposta de sucesso específica para atualização de ordem
    ApiResponse({
      status: 200,
      description: `Ordem dos ${resourceNamePlural.toLowerCase()} atualizada com sucesso`,
    }),
  );
}
