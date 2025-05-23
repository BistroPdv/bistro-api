import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/create-auth.dto';

interface JWTPayload {
  userId: string;
  username: string;
  restaurantCnpj: string;
  appToken?: string;
  role: 'SYSADMIN' | 'OWNER' | 'MANAGER' | 'USER';
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTPayload;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        token: 'string',
        appToken: 'string',
        user: {
          id: 'string',
          username: 'string',
          role: 'string',
          restaurantCnpj: 'string',
          nome: 'string',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Usuário ou senha inválidos',
        error: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Restaurante não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Restaurante não encontrado',
        error: 'Not Found',
      },
    },
  })
  async login(@Body() body: AuthLoginDto, @Req() req: FastifyRequest) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
      body.cnpj,
    );

    req.user = {
      userId: user.user.id,
      username: user.user.username,
      restaurantCnpj: user.user.restaurantCnpj,
      role: user.user.role,
    };

    return user;
  }
}
