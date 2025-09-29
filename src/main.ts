import multipart from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ErrorResponseInterceptor } from './common/interceptors/error-response.interceptor';
import Default from './config/configuration';
import { PrismaService } from './database/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: Default().envToLogger[process.env.NODE_ENV],
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: '*',
  });

  // Configuração de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Bistro API')
    .setDescription(
      `
      Documentação da API do Bistro
      
      ## Tratamento de Erros
      
      Esta API utiliza um sistema padronizado de tratamento de erros que retorna respostas consistentes em todos os endpoints.
      
      ### Formato de Resposta de Erro
      
      Todas as respostas de erro seguem o seguinte formato:
      
      \`\`\`json
      {
        "statusCode": 400,
        "message": "Mensagem de erro principal",
        "errorCode": "VALIDATION_ERROR",
        "details": ["Detalhes adicionais do erro"],
        "timestamp": "2024-01-15T10:30:00.000Z",
        "path": "/api/endpoint",
        "method": "POST",
        "errorId": "err_1705312200000_abc123def"
      }
      \`\`\`
      
      ### Códigos de Erro Disponíveis
      
      - **VALIDATION_ERROR**: Erro de validação (400)
      - **UNAUTHORIZED**: Não autorizado (401)
      - **FORBIDDEN**: Acesso negado (403)
      - **NOT_FOUND**: Recurso não encontrado (404)
      - **ALREADY_EXISTS**: Recurso já existe (409)
      - **INTERNAL_ERROR**: Erro interno (500)
      - **EXTERNAL_SERVICE_ERROR**: Erro em serviço externo (502)
      
      ### Rastreamento de Erros
      
      Cada erro inclui um \`errorId\` único que pode ser usado para rastreamento e debugging. 
      Use este ID ao reportar problemas para a equipe de desenvolvimento.
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Endpoints de autenticação')
    .addTag('Categories', 'Gerenciamento de categorias')
    .addTag('Dashboard', 'Dashboard e relatórios')
    .addTag('Integrations', 'Integrações externas')
    .addTag('Payments', 'Gerenciamento de pagamentos')
    .addTag('Pedidos', 'Gerenciamento de pedidos')
    .addTag('Products', 'Gerenciamento de produtos')
    .addTag('Restaurants', 'Gerenciamento de restaurantes')
    .addTag('Settings', 'Configurações do sistema')
    .addTag('Tables', 'Gerenciamento de mesas')
    .addTag('Users', 'Gerenciamento de usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      url: `${process.env.API_URL}/docs`,
      content: document,
      title: 'Bistro API',
      withFastify: true,
      description: 'Documentação da API do Bistro',
      version: '1.0',
      theme: 'saturn',
    }),
  );

  // Configuração global de tratamento de erros
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configuração de interceptors
  const jwtService = app.get(JwtService);
  const prismaService = app.get(PrismaService);
  app.useGlobalInterceptors(
    new JwtInterceptor(jwtService, prismaService),
    new ErrorResponseInterceptor(),
  );

  app.register(multipart as any, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
      files: 1,
    },
  });

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
