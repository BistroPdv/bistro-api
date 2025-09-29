import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
    type: 'integer',
    minimum: 100,
    maximum: 599,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro principal',
    example: 'Dados inválidos fornecidos',
    type: 'string',
  })
  message: string;

  @ApiProperty({
    description: 'Código de erro interno para identificação',
    example: 'VALIDATION_ERROR',
    required: false,
    enum: [
      'VALIDATION_ERROR',
      'INVALID_DATA',
      'MISSING_REQUIRED_FIELD',
      'UNAUTHORIZED',
      'FORBIDDEN',
      'INVALID_CREDENTIALS',
      'TOKEN_EXPIRED',
      'NOT_FOUND',
      'ALREADY_EXISTS',
      'CONFLICT',
      'INSUFFICIENT_PERMISSIONS',
      'OPERATION_NOT_ALLOWED',
      'QUOTA_EXCEEDED',
      'EXTERNAL_SERVICE_ERROR',
      'INTEGRATION_ERROR',
      'INTERNAL_ERROR',
      'SERVICE_UNAVAILABLE',
      'TIMEOUT',
    ],
  })
  errorCode?: string;

  @ApiProperty({
    description: 'Detalhes adicionais do erro',
    example: ['O campo nome é obrigatório', 'O email deve ter formato válido'],
    required: false,
    type: [String],
  })
  details?: string[];

  @ApiProperty({
    description: 'Timestamp do erro em formato ISO 8601',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição que causou o erro',
    example: '/api/categorias',
    type: 'string',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  })
  method: string;

  @ApiProperty({
    description: 'ID único do erro para rastreamento e debugging',
    example: 'err_1705312200000_abc123def',
    required: false,
    type: 'string',
    pattern: '^err_\\d+_[a-z0-9]+$',
  })
  errorId?: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Detalhes dos erros de validação por campo',
    example: {
      nome: ['O campo nome é obrigatório'],
      email: ['O email deve ter formato válido'],
    },
    required: false,
    additionalProperties: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  })
  validationErrors?: Record<string, string[]>;
}
