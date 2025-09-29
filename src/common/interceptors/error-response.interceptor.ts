import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const { method, url } = request;

    return next.handle().pipe(
      map((data) => {
        // Log de sucesso para operações importantes
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
          this.logger.log(`Success: ${method} ${url}`);
        }
        return data;
      }),
      catchError((error) => {
        // Log de erro com contexto adicional
        this.logger.error(
          `Error in ${method} ${url}: ${error.message}`,
          error.stack,
          {
            method,
            url,
            error: error.name,
            message: error.message,
          },
        );

        return throwError(() => error);
      }),
    );
  }
}
