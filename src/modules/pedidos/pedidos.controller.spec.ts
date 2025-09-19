import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StatusPedido } from './dto';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

describe('PedidosController', () => {
  let controller: PedidosController;
  let service: PedidosService;

  const mockPedidosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByMesa: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockRequest = {
    user: {
      restaurantCnpj: '12345678901234',
    },
    body: {},
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosController],
      providers: [
        {
          provide: PedidosService,
          useValue: mockPedidosService,
        },
      ],
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
    service = module.get<PedidosService>(PedidosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar lista de pedidos com sucesso', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockPedidosService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query, mockRequest);

      expect(service.findAll).toHaveBeenCalledWith({
        ...query,
        cnpj: mockRequest.user.restaurantCnpj,
      });
      expect(result).toEqual(expectedResult);
    });

    it('deve lançar HttpException quando service falha', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const error = new Error('Erro interno');

      mockPedidosService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(query, mockRequest)).rejects.toThrow(
        'Erro interno',
      );
    });

    it('deve propagar HttpException do service', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const httpError = new HttpException(
        'Erro específico',
        HttpStatus.BAD_REQUEST,
      );

      mockPedidosService.findAll.mockRejectedValue(httpError);

      await expect(controller.findAll(query, mockRequest)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar pedido específico com sucesso', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expectedResult = {
        id,
        status: 'ABERTO' as StatusPedido,
        mesa: { numero: '1', id: 'mesa-id' },
        produtos: [],
      };

      mockPedidosService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id, mockRequest);

      expect(service.findOne).toHaveBeenCalledWith(
        id,
        mockRequest.user.restaurantCnpj,
      );
      expect(result).toEqual(expectedResult);
    });

    it('deve retornar null quando pedido não encontrado', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';

      mockPedidosService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(id, mockRequest);

      expect(service.findOne).toHaveBeenCalledWith(
        id,
        mockRequest.user.restaurantCnpj,
      );
      expect(result).toBeNull();
    });
  });

  describe('findByMesa', () => {
    it('deve retornar pedidos da mesa com sucesso', async () => {
      const mesaId = '550e8400-e29b-41d4-a716-446655440000';
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const prodImage = 'false';
      const status = 'ABERTO' as StatusPedido;
      const expectedResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockPedidosService.findByMesa.mockResolvedValue(expectedResult);

      const result = await controller.findByMesa(
        mesaId,
        query,
        status,
        prodImage,
        mockRequest,
      );

      expect(service.findByMesa).toHaveBeenCalledWith(
        mesaId,
        mockRequest.user.restaurantCnpj,
        query,
        status,
        false,
      );
      expect(result).toEqual(expectedResult);
    });

    it('deve retornar pedidos da mesa sem status', async () => {
      const mesaId = '550e8400-e29b-41d4-a716-446655440000';
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const prodImage = 'false';
      const expectedResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockPedidosService.findByMesa.mockResolvedValue(expectedResult);

      const result = await controller.findByMesa(
        mesaId,
        query,
        undefined as any,
        prodImage,
        mockRequest,
      );

      expect(service.findByMesa).toHaveBeenCalledWith(
        mesaId,
        mockRequest.user.restaurantCnpj,
        query,
        undefined,
        false,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('deve criar pedido com sucesso', async () => {
      const createData = {
        mesa: { connect: { id: 'mesa-id' } },
        produtos: [
          {
            produto: { connect: { id: 'produto-id' } },
            quantidade: 2,
            adicionais: [
              {
                adicional: { connect: { id: 'adicional-id' } },
                quantidade: 1,
                preco: 5.0,
              },
            ],
          },
        ],
      };

      const mockRequestWithBody = {
        ...mockRequest,
        body: createData,
      } as any;

      const expectedResult = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'ABERTO' as StatusPedido,
        mesa: { numero: '1', id: 'mesa-id' },
        produtos: [],
      };

      mockPedidosService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(mockRequestWithBody);

      expect(service.create).toHaveBeenCalledWith(
        { mesa: { connect: { id: 'mesa-id' } } },
        expect.arrayContaining([
          expect.objectContaining({
            produto: { connect: { id: 'produto-id' } },
            quantidade: 2,
            adicionais: expect.arrayContaining([
              expect.objectContaining({
                adicional: { connect: { id: 'adicional-id' } },
                quantidade: 1,
                preco: 5.0,
              }),
            ]),
          }),
        ]),
        mockRequest.user.restaurantCnpj,
      );
      expect(result).toEqual(expectedResult);
    });

    it('deve lançar HttpException quando CNPJ não encontrado', async () => {
      const mockRequestWithoutCnpj = {
        ...mockRequest,
        user: { restaurantCnpj: undefined },
      } as any;

      await expect(controller.create(mockRequestWithoutCnpj)).rejects.toThrow(
        new HttpException('CNPJ não encontrado', HttpStatus.BAD_REQUEST),
      );
    });

    it('deve lançar HttpException quando service falha', async () => {
      const createData = {
        mesa: { connect: { id: 'mesa-id' } },
        produtos: [],
      };

      const mockRequestWithBody = {
        ...mockRequest,
        body: createData,
      } as any;

      const error = new Error('Erro interno');

      mockPedidosService.create.mockRejectedValue(error);

      await expect(controller.create(mockRequestWithBody)).rejects.toThrow(
        'Erro interno',
      );
    });

    it('deve propagar HttpException do service', async () => {
      const createData = {
        mesa: { connect: { id: 'mesa-id' } },
        produtos: [],
      };

      const mockRequestWithBody = {
        ...mockRequest,
        body: createData,
      } as any;

      const httpError = new HttpException(
        'Erro específico',
        HttpStatus.BAD_REQUEST,
      );

      mockPedidosService.create.mockRejectedValue(httpError);

      await expect(controller.create(mockRequestWithBody)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar pedido com sucesso', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        status: 'FINALIZADO' as StatusPedido,
        pdvCodPedido: 'PED123456',
        motivoCancelamento: null,
      };

      const mockRequestWithBody = {
        ...mockRequest,
        body: updateData,
      } as any;

      const expectedResult = {
        id,
        status: 'FINALIZADO' as StatusPedido,
        pdvCodPedido: 'PED123456',
        updatedAt: new Date(),
      };

      mockPedidosService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, mockRequestWithBody);

      expect(service.update).toHaveBeenCalledWith(
        {
          status: updateData.status,
          pdvCodPedido: updateData.pdvCodPedido,
          motivoCancelamento: updateData.motivoCancelamento,
        },
        id,
      );
      expect(result).toEqual(expectedResult);
    });

    it('deve atualizar pedido cancelado com motivo', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        status: 'CANCELADO' as StatusPedido,
        pdvCodPedido: 'PED123456',
        motivoCancelamento: 'Cliente desistiu',
      };

      const mockRequestWithBody = {
        ...mockRequest,
        body: updateData,
      } as any;

      const expectedResult = {
        id,
        status: 'CANCELADO' as StatusPedido,
        motivoCancelamento: 'Cliente desistiu',
        updatedAt: new Date(),
      };

      mockPedidosService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, mockRequestWithBody);

      expect(service.update).toHaveBeenCalledWith(
        {
          status: updateData.status,
          pdvCodPedido: updateData.pdvCodPedido,
          motivoCancelamento: updateData.motivoCancelamento,
        },
        id,
      );
      expect(result).toEqual(expectedResult);
    });

    it('deve lançar HttpException quando CNPJ não encontrado', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        status: 'FINALIZADO' as StatusPedido,
        pdvCodPedido: 'PED123456',
        motivoCancelamento: null,
      };

      const mockRequestWithoutCnpj = {
        ...mockRequest,
        user: { restaurantCnpj: null },
        body: updateData,
      } as any;

      await expect(
        controller.update(id, mockRequestWithoutCnpj),
      ).rejects.toThrow(
        new HttpException('CNPJ não encontrado', HttpStatus.BAD_REQUEST),
      );
    });

    it('deve lançar HttpException quando service falha', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        status: 'FINALIZADO' as StatusPedido,
        pdvCodPedido: 'PED123456',
        motivoCancelamento: null,
      };

      const mockRequestWithBody = {
        ...mockRequest,
        body: updateData,
      } as any;

      const error = new Error('Erro interno');

      mockPedidosService.update.mockRejectedValue(error);

      await expect(controller.update(id, mockRequestWithBody)).rejects.toThrow(
        'Erro interno',
      );
    });

    it('deve propagar HttpException do service', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        status: 'FINALIZADO' as StatusPedido,
        pdvCodPedido: 'PED123456',
        motivoCancelamento: null,
      };

      const mockRequestWithBody = {
        ...mockRequest,
        body: updateData,
      } as any;

      const httpError = new HttpException(
        'Erro específico',
        HttpStatus.BAD_REQUEST,
      );

      mockPedidosService.update.mockRejectedValue(httpError);

      await expect(controller.update(id, mockRequestWithBody)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('delete', () => {
    it('deve deletar pedido com sucesso', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expectedResult = {
        id,
        delete: true,
        updatedAt: new Date(),
      };

      mockPedidosService.delete.mockResolvedValue(expectedResult);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('deve retornar null quando pedido não encontrado para deletar', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';

      mockPedidosService.delete.mockResolvedValue(null);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  describe('validações de entrada', () => {
    it('deve validar parâmetros de paginação corretamente', async () => {
      const query: PaginationQueryDto = {
        page: 1,
        limit: 10,
        search: { id: 'PED123' },
      };
      const expectedResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockPedidosService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query, mockRequest);

      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: { id: 'PED123' },
        cnpj: mockRequest.user.restaurantCnpj,
      });
      expect(result).toEqual(expectedResult);
    });

    it('deve validar UUIDs corretamente', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expectedResult = {
        id,
        status: 'ABERTO' as StatusPedido,
        mesa: { numero: '1', id: 'mesa-id' },
        produtos: [],
      };

      mockPedidosService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id, mockRequest);

      expect(service.findOne).toHaveBeenCalledWith(
        id,
        mockRequest.user.restaurantCnpj,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('tratamento de erros', () => {
    it('deve tratar erros de validação do service', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const validationError = new HttpException(
        'Dados inválidos',
        HttpStatus.BAD_REQUEST,
      );

      mockPedidosService.findAll.mockRejectedValue(validationError);

      await expect(controller.findAll(query, mockRequest)).rejects.toThrow(
        HttpException,
      );
    });

    it('deve tratar erros de not found do service', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const notFoundError = new HttpException(
        'Pedido não encontrado',
        HttpStatus.NOT_FOUND,
      );

      mockPedidosService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne(id, mockRequest)).rejects.toThrow(
        HttpException,
      );
    });

    it('deve tratar erros internos do service', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const internalError = new Error('Erro interno do banco');

      mockPedidosService.findAll.mockRejectedValue(internalError);

      await expect(controller.findAll(query, mockRequest)).rejects.toThrow(
        'Erro interno',
      );
    });
  });
});
