import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
} from '../dto/error-response.dto';
import {
  BusinessErrorCode,
  BusinessException,
} from '../exceptions/business.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const reply = ctx.getResponse<FastifyReply>();

    const errorResponse = this.buildErrorResponse(exception, request);

    // Log do erro
    this.logError(exception, request, errorResponse);

    reply.status(errorResponse.statusCode).send(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: FastifyRequest,
  ): ErrorResponseDto {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;
    const errorId = this.generateErrorId();

    // BusinessException customizada
    if (exception instanceof BusinessException) {
      return {
        statusCode: exception.getStatus(),
        message: exception.message,
        errorCode: exception.errorCode,
        details: exception.details,
        timestamp,
        path,
        method,
        errorId: exception.errorId || errorId,
      };
    }

    // HttpException do NestJS
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const statusCode = exception.getStatus();

      // Tratamento especial para erros de validação
      if (
        statusCode === HttpStatus.BAD_REQUEST &&
        typeof response === 'object'
      ) {
        const validationResponse = response as any;
        if (
          validationResponse.message &&
          Array.isArray(validationResponse.message)
        ) {
          return {
            statusCode,
            message: 'Dados inválidos fornecidos',
            errorCode: BusinessErrorCode.VALIDATION_ERROR,
            details: validationResponse.message,
            timestamp,
            path,
            method,
            errorId,
          } as ValidationErrorResponseDto;
        }
      }

      return {
        statusCode,
        message: exception.message,
        errorCode: this.mapHttpStatusToErrorCode(statusCode),
        timestamp,
        path,
        method,
        errorId,
      };
    }

    // Erros do Prisma
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(
        exception,
        timestamp,
        path,
        method,
        errorId,
      );
    }

    if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro interno do banco de dados',
        errorCode: BusinessErrorCode.INTERNAL_ERROR,
        timestamp,
        path,
        method,
        errorId,
      };
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro de validação do banco de dados',
        errorCode: BusinessErrorCode.VALIDATION_ERROR,
        timestamp,
        path,
        method,
        errorId,
      };
    }

    // Erro genérico
    const error = exception as Error;
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
      errorCode: BusinessErrorCode.INTERNAL_ERROR,
      timestamp,
      path,
      method,
      errorId,
    };
  }

  private handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
    timestamp: string,
    path: string,
    method: string,
    errorId: string,
  ): ErrorResponseDto {
    let statusCode = HttpStatus.BAD_REQUEST;
    let message = 'Erro desconhecido';
    let errorCode = BusinessErrorCode.INTERNAL_ERROR;

    switch (exception.code) {
      case 'P2000':
        statusCode = HttpStatus.BAD_REQUEST;
        message = `O valor fornecido para '${exception.meta?.target}' é muito longo.`;
        errorCode = BusinessErrorCode.VALIDATION_ERROR;
        break;
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = `O valor para '${exception.meta?.target}' já está em uso.`;
        errorCode = BusinessErrorCode.ALREADY_EXISTS;
        break;
      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;
        message =
          'Não é possível excluir ou modificar devido a uma referência em outro registro.';
        errorCode = BusinessErrorCode.OPERATION_NOT_ALLOWED;
        break;
      case 'P2005':
        statusCode = HttpStatus.BAD_REQUEST;
        message = `O formato do valor fornecido para '${exception.meta?.target}' é inválido.`;
        errorCode = BusinessErrorCode.VALIDATION_ERROR;
        break;
      case 'P2011':
        statusCode = HttpStatus.BAD_REQUEST;
        message = `O campo '${exception.meta?.target}' não pode ser nulo.`;
        errorCode = BusinessErrorCode.MISSING_REQUIRED_FIELD;
        break;
      case 'P2012':
        statusCode = HttpStatus.BAD_REQUEST;
        message = `O campo obrigatório '${exception.meta?.target}' está faltando.`;
        errorCode = BusinessErrorCode.MISSING_REQUIRED_FIELD;
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Registro não encontrado.';
        errorCode = BusinessErrorCode.NOT_FOUND;
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Erro interno do banco de dados.';
        errorCode = BusinessErrorCode.INTERNAL_ERROR;
        break;
    }

    return {
      statusCode,
      message,
      errorCode,
      timestamp,
      path,
      method,
      errorId,
    };
  }

  private mapHttpStatusToErrorCode(statusCode: number): BusinessErrorCode {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return BusinessErrorCode.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return BusinessErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return BusinessErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return BusinessErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return BusinessErrorCode.CONFLICT;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return BusinessErrorCode.INTERNAL_ERROR;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return BusinessErrorCode.SERVICE_UNAVAILABLE;
      default:
        return BusinessErrorCode.INTERNAL_ERROR;
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logError(
    exception: unknown,
    request: FastifyRequest,
    errorResponse: ErrorResponseDto,
  ): void {
    const { method, url, headers, body } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const ip = request.ip || 'unknown';

    const logContext = {
      errorId: errorResponse.errorId,
      method,
      url,
      userAgent,
      ip,
      statusCode: errorResponse.statusCode,
      errorCode: errorResponse.errorCode,
      body: this.sanitizeBody(body),
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `Internal Server Error: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : String(exception),
        logContext,
      );
    } else if (errorResponse.statusCode >= 400) {
      this.logger.warn(`Client Error: ${errorResponse.message}`, logContext);
    }
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'senha', 'token', 'secret', 'key'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
