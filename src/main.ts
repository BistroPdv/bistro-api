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
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
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

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Bistro API')
    .setDescription('Documentação da API do Bistro')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // await app.register(fastifySwagger as any);

  // SwaggerModule.setup('docs', app, document);

  app.use(
    '/docs',
    apiReference({
      url: 'http://10.10.1.162:4000/docs',
      content: document,
      title: 'Bistro API',
      withFastify: true,
      description: 'Documentação da API do Bistro',
      version: '1.0',
      theme: 'saturn',
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  const jwtService = app.get(JwtService);
  const prismaService = app.get(PrismaService);
  app.useGlobalInterceptors(new JwtInterceptor(jwtService, prismaService));

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
