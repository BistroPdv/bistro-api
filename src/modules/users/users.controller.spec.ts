import { PaginationResponseDto } from '@/common/dto/pagination-resp.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Role } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService(new PrismaService());
    usersController = new UsersController(usersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = new PaginationResponseDto(
        [
          {
            id: '1',
            nome: 'test',
            username: 'test',
            password: 'test',
            email: 'test',
            delete: false,
            ativo: true,
            role: Role.USER,
            restaurantCnpj: '12345678901234',
            createdAt: new Date(),
            updatedAt: new Date(),
            restaurant: {
              id: '1',
              nome: 'test',
              cnpj: '12345678901234',
              createdAt: new Date(),
              updatedAt: new Date(),
              delete: false,
              email: 'test@test.com',
              name: 'test',
              phone: '1234567890',
              logo: null,
              nfe: false,
              appToken: 'token',
              pdvIntegrations: null,
              printerNotification: null,
              printerBill: null,
              adminPassword: null,
            },
          },
        ],
        1,
        1,
        1,
      );
      jest
        .spyOn(usersService, 'findAll')
        .mockImplementation((query) => Promise.resolve(result));

      expect(
        await usersController.findAll(
          {
            page: 1,
            limit: 10,
          },
          { user: { restaurantCnpj: '12345678901234' } } as any,
        ),
      ).toBe(result);
    });
  });
});
