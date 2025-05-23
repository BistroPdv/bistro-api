import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = this.jwtService.decode(token);
        request.user = {
          userId: decoded.userId,
          username: decoded.username,
          restaurantCnpj: decoded.restaurantCnpj,
          appToken: decoded.appToken,
          role: decoded.role,
        };
      } catch (error) {
        console.log(error);
        // Token inválido ou expirado - não fazemos nada
      }
    }

    return next.handle();
  }
}
