import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma/prisma.service';

describe('PedidosController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const dataRestaurant = {
    cnpj: '12345678901234',
    name: 'Restaurante Teste',
    email: 'teste@restaurante.com',
    phone: '11999999999',
    nfe: false,
    appToken: 'test-token',
  };

  const dataUser: Prisma.UserCreateInput = {
    username: 'testuser',
    email: 'test@user.com',
    password: 'hashedpassword',
    role: 'USER',
    restaurant: {
      connect: {
        cnpj: dataRestaurant.cnpj,
      },
    },
    ativo: true,
  };

  // Dados de teste
  let testRestaurant: any;
  let testMesa: any;
  let testProduto: any;
  let testAdicional: any;
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Limpar banco de dados de teste
    await cleanupDatabase();

    // Criar dados de teste
    await setupTestData();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await app.close();
  });

  const cleanupDatabase = async () => {
    // Limpar na ordem correta respeitando foreign keys
    await prismaService.pedidoProdutoAdicional.deleteMany({
      where: {
        pedidoProduto: {
          pedido: {
            restaurantCnpj: dataRestaurant.cnpj,
          },
        },
      },
    });
    await prismaService.pedidoProduto.deleteMany({
      where: {
        pedido: {
          restaurantCnpj: dataRestaurant.cnpj,
        },
      },
    });
    await prismaService.pedidos.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.payments.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.paymentMethod.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.mesa.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.produto.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.categoria.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.user.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.impressora.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.banner.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.filial.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.whiteLabel.deleteMany({
      where: {
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });
    await prismaService.integrationOmie.deleteMany({
      where: {
        restaurant: {
          cnpj: dataRestaurant.cnpj,
        },
      },
    });
    await prismaService.restaurant.deleteMany({
      where: {
        cnpj: dataRestaurant.cnpj,
      },
    });
  };

  const setupTestData = async () => {
    // Criar restaurante
    testRestaurant = await prismaService.restaurant.create({
      data: {
        ...dataRestaurant,
      },
    });

    // Criar usuário
    testUser = await prismaService.user.create({
      data: {
        ...dataUser,
      },
    });

    // Criar categoria
    const categoria = await prismaService.categoria.create({
      data: {
        nome: 'Categoria Teste',
        restaurantCnpj: dataRestaurant.cnpj,
        ativo: true,
      },
    });

    // Criar produto
    testProduto = await prismaService.produto.create({
      data: {
        nome: 'Produto Teste',
        preco: 25.5,
        descricao: 'Descrição do produto teste',
        imagem: 'produto.jpg',
        codigo: 'PROD001',
        categoriaId: categoria.id,
        restaurantCnpj: dataRestaurant.cnpj,
        ativo: true,
      },
    });

    // Criar adicional
    testAdicional = await prismaService.adicionalHeader.create({
      data: {
        titulo: 'Adicional Teste',
        categoriaId: categoria.id,
        ativo: true,
      },
    });

    // Criar mesa
    testMesa = await prismaService.mesa.create({
      data: {
        numero: 1,
        restaurantCnpj: dataRestaurant.cnpj,
      },
    });

    // Gerar token JWT
    authToken = jwtService.sign({
      userId: testUser.id,
      username: testUser.username,
      role: testUser.role,
      restaurantCnpj: dataRestaurant.cnpj,
    });
  };

  describe('/pedidos (GET)', () => {
    it('deve retornar lista de pedidos', async () => {
      // Criar um pedido de teste
      const pedido = await prismaService.pedidos.create({
        data: {
          status: 'ABERTO',
          mesaId: testMesa.id,
          restaurantCnpj: dataRestaurant.cnpj,
        },
      });

      await prismaService.pedidoProduto.create({
        data: {
          pedidoId: pedido.id,
          produtoId: testProduto.id,
          quantidade: 2,
          status: 'AGUARDANDO',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/pedidos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPage');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve retornar 401 sem token de autorização', async () => {
      await request(app.getHttpServer()).get('/pedidos').expect(401);
    });

    it('deve retornar lista vazia quando não há pedidos', async () => {
      // Limpar pedidos existentes
      await prismaService.pedidoProduto.deleteMany();
      await prismaService.pedidos.deleteMany();

      const response = await request(app.getHttpServer())
        .get('/pedidos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });
  });

  describe('/pedidos/:id (GET)', () => {
    it('deve retornar pedido específico', async () => {
      // Criar pedido de teste
      const pedido = await prismaService.pedidos.create({
        data: {
          status: 'ABERTO',
          mesaId: testMesa.id,
          restaurantCnpj: dataRestaurant.cnpj,
        },
      });

      await prismaService.pedidoProduto.create({
        data: {
          pedidoId: pedido.id,
          produtoId: testProduto.id,
          quantidade: 1,
          status: 'AGUARDANDO',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/pedidos/${pedido.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', pedido.id);
      expect(response.body).toHaveProperty('status', 'ABERTO');
      expect(response.body).toHaveProperty('mesa');
      expect(response.body).toHaveProperty('produtos');
    });

    it('deve retornar 404 para pedido inexistente', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';

      await request(app.getHttpServer())
        .get(`/pedidos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/pedidos/mesa/:id (GET)', () => {
    it('deve retornar pedidos da mesa', async () => {
      // Criar pedido na mesa
      const pedido = await prismaService.pedidos.create({
        data: {
          status: 'ABERTO',
          mesaId: testMesa.id,
          restaurantCnpj: dataRestaurant.cnpj,
        },
      });

      await prismaService.pedidoProduto.create({
        data: {
          pedidoId: pedido.id,
          produtoId: testProduto.id,
          quantidade: 1,
          status: 'AGUARDANDO',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/pedidos/mesa/${testMesa.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('deve filtrar pedidos por status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/pedidos/mesa/${testMesa.id}?status=ABERTO`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('/pedidos (POST)', () => {
    it('deve criar novo pedido com sucesso', async () => {
      const pedidoData = {
        mesa: { connect: { id: testMesa.id } },
        produtos: [
          {
            produto: { connect: { id: testProduto.id } },
            quantidade: 2,
            adicionais: [
              {
                adicional: { connect: { id: testAdicional.id } },
                quantidade: 1,
                preco: 5.0,
              },
            ],
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/pedidos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pedidoData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'ABERTO');
      expect(response.body).toHaveProperty('mesa');
      expect(response.body).toHaveProperty('produtos');
      expect(Array.isArray(response.body.produtos)).toBe(true);
    });

    it('deve retornar 400 quando CNPJ não encontrado', async () => {
      // Criar token sem CNPJ
      const invalidToken = jwtService.sign({
        userId: testUser.id,
        username: testUser.username,
        role: testUser.role,
        // sem restaurantCnpj
      });

      const pedidoData = {
        mesa: { connect: { id: testMesa.id } },
        produtos: [
          {
            produto: { connect: { id: testProduto.id } },
            quantidade: 1,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/pedidos')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(pedidoData)
        .expect(400);
    });

    it('deve retornar 400 quando dados inválidos', async () => {
      const invalidData = {
        mesa: { connect: { id: 'invalid-id' } },
        produtos: [],
      };

      await request(app.getHttpServer())
        .post('/pedidos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('/pedidos/:id (PUT)', () => {
    it('deve atualizar pedido com sucesso', async () => {
      // Criar pedido para atualizar
      const pedido = await prismaService.pedidos.create({
        data: {
          status: 'ABERTO',
          mesaId: testMesa.id,
          restaurantCnpj: dataRestaurant.cnpj,
        },
      });

      const updateData = {
        status: 'FINALIZADO',
        pdvCodPedido: 'PED123456',
        motivoCancelamento: null,
      };

      const response = await request(app.getHttpServer())
        .put(`/pedidos/${pedido.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', pedido.id);
      expect(response.body).toHaveProperty('status', 'FINALIZADO');
      expect(response.body).toHaveProperty('pdvCodPedido', 'PED123456');
    });

    it('deve atualizar pedido cancelado com motivo', async () => {
      // Criar pedido para cancelar
      const pedido = await prismaService.pedidos.create({
        data: {
          status: 'ABERTO',
          mesaId: testMesa.id,
          restaurantCnpj: dataRestaurant.cnpj,
        },
      });

      const updateData = {
        status: 'CANCELADO',
        pdvCodPedido: 'PED123456',
        motivoCancelamento: 'Cliente desistiu',
      };

      const response = await request(app.getHttpServer())
        .put(`/pedidos/${pedido.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', pedido.id);
      expect(response.body).toHaveProperty('status', 'CANCELADO');
      expect(response.body).toHaveProperty(
        'motivoCancelamento',
        'Cliente desistiu',
      );
    });

    it('deve retornar 404 para pedido inexistente', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        status: 'FINALIZADO',
        pdvCodPedido: 'PED123456',
      };

      await request(app.getHttpServer())
        .put(`/pedidos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('/pedidos/:id (DELETE)', () => {
    it('deve deletar pedido com sucesso', async () => {
      // Criar pedido para deletar
      const pedido = await prismaService.pedidos.create({
        data: {
          status: 'ABERTO',
          mesaId: testMesa.id,
          restaurantCnpj: dataRestaurant.cnpj,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/pedidos/${pedido.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', pedido.id);
      expect(response.body).toHaveProperty('delete', true);
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('deve retornar 404 para pedido inexistente', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';

      await request(app.getHttpServer())
        .delete(`/pedidos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Validações e Tratamento de Erros', () => {
    it('deve validar paginação corretamente', async () => {
      const response = await request(app.getHttpServer())
        .get('/pedidos?page=1&limit=10&search={"id":"test"}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 10);
    });

    it('deve retornar 401 com token inválido', async () => {
      await request(app.getHttpServer())
        .get('/pedidos')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('deve retornar 401 sem token', async () => {
      await request(app.getHttpServer()).get('/pedidos').expect(401);
    });
  });
});
