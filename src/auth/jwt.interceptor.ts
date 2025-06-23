import { PrismaService } from '@/database/prisma/prisma.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { Observable, from, switchMap } from 'rxjs';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  /**
   * Construtor do interceptor JWT
   * @param jwtService - Serviço para manipulação de tokens JWT
   * @param prisma - Serviço do Prisma para acesso ao banco de dados
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Intercepta as requisições para validar e renovar tokens JWT
   * @param context - Contexto de execução da requisição
   * @param next - Próximo handler na cadeia
   * @returns Observable com o resultado da requisição
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const appToken = request.headers["app-token"] as string;
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log(["VERIFICANDO TOKEN"]);


      try {
        const decoded = this.jwtService.decode(token);
        request.user = {
          userId: decoded.userId,
          username: decoded.username,
          restaurantCnpj: decoded.restaurantCnpj,
          appToken: decoded.appToken,
          role: decoded.role,
        };
        return next.handle();
      } catch (error) {
        console.log(error);
        // Se o token estiver expirado e tiver appToken, tenta fazer refresh
        if (error instanceof TokenExpiredError && appToken) {
          // Decodifica o token expirado sem verificar a assinatura
          const decodedExpiredToken = this.jwtService.decode(token);

          // Verifica se tem appToken para tentar refresh
          if (
            decodedExpiredToken &&
            decodedExpiredToken.appToken &&
            decodedExpiredToken.restaurantCnpj
          ) {
            // Retorna um Observable que faz a verificação assíncrona
            return from(
              this.prisma.restaurant.findUnique({
                where: {
                  cnpj: decodedExpiredToken.restaurantCnpj,
                  appToken,
                },
              })
            ).pipe(
              switchMap((restaurant) => {
                if (restaurant) {
                  // Gera um novo token com as mesmas informações
                  const newToken = this.jwtService.sign(
                    {
                      userId: decodedExpiredToken.userId,
                      username: decodedExpiredToken.username,
                      restaurantCnpj: decodedExpiredToken.restaurantCnpj,
                      appToken: decodedExpiredToken.appToken,
                      role: decodedExpiredToken.role,
                    },
                    { expiresIn: "24h" }
                  );

                  // Atualiza o token no cabeçalho da requisição
                  request.headers.authorization = `Bearer ${newToken}`;

                  // Atualiza o user na requisição
                  request.user = this.jwtService.decode(newToken);
                }
                return next.handle();
              })
            );
          }
        }
        return next.handle();
      }
    }

    return next.handle();
  }
}
