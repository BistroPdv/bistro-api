import { HttpException, HttpStatus } from '@nestjs/common';

export enum BusinessErrorCode {
  // Validação
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_DATA = 'INVALID_DATA',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Autenticação e Autorização
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Recursos
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Negócio
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  // Integração
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTEGRATION_ERROR = 'INTEGRATION_ERROR',

  // Sistema
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
}

export class BusinessException extends HttpException {
  public readonly errorCode: BusinessErrorCode;
  public readonly details?: string[];
  public readonly errorId?: string;

  constructor(
    message: string,
    errorCode: BusinessErrorCode,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: string[],
    errorId?: string,
  ) {
    super(message, statusCode);
    this.errorCode = errorCode;
    this.details = details;
    this.errorId = errorId;
  }

  static validation(message: string, details?: string[], errorId?: string) {
    return new BusinessException(
      message,
      BusinessErrorCode.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST,
      details,
      errorId,
    );
  }

  static notFound(resource: string, errorId?: string) {
    return new BusinessException(
      `${resource} não encontrado`,
      BusinessErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      undefined,
      errorId,
    );
  }

  static alreadyExists(resource: string, field?: string, errorId?: string) {
    const message = field
      ? `${resource} com ${field} já existe`
      : `${resource} já existe`;

    return new BusinessException(
      message,
      BusinessErrorCode.ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      undefined,
      errorId,
    );
  }

  static unauthorized(message: string = 'Não autorizado', errorId?: string) {
    return new BusinessException(
      message,
      BusinessErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED,
      undefined,
      errorId,
    );
  }

  static forbidden(message: string = 'Acesso negado', errorId?: string) {
    return new BusinessException(
      message,
      BusinessErrorCode.FORBIDDEN,
      HttpStatus.FORBIDDEN,
      undefined,
      errorId,
    );
  }

  static internalError(
    message: string = 'Erro interno do servidor',
    errorId?: string,
  ) {
    return new BusinessException(
      message,
      BusinessErrorCode.INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      undefined,
      errorId,
    );
  }

  static externalServiceError(service: string, errorId?: string) {
    return new BusinessException(
      `Erro no serviço externo: ${service}`,
      BusinessErrorCode.EXTERNAL_SERVICE_ERROR,
      HttpStatus.BAD_GATEWAY,
      undefined,
      errorId,
    );
  }
}
