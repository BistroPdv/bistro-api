import { PrismaService } from '@/database/prisma/prisma.service';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { RestaurantsService } from '../modules/restaurants/restaurants.service';

export interface TypeUserAuth {
  token: string;
  appToken: string;
  user: {
    id: string;
    username: string;
    role: Role;
    restaurantCnpj: string;
    nome: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async validateUser(
    username: string,
    password: string,
    restaurantCnpj: string,
  ): Promise<TypeUserAuth> {
    let user = await this.usersService.findByUsername(username, restaurantCnpj);
    const userSysAdmin = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
    const restaurant = await this.restaurantsService.findOne(restaurantCnpj);

    if (!restaurant) {
      throw new UnauthorizedException('Restaurante não encontrado');
    }

    if (userSysAdmin?.role === Role.SYSADMIN) {
      user = userSysAdmin;
      if (!user?.ativo) {
        throw new UnauthorizedException('Usuário desativado');
      }
    } else {
      if (!user) {
        throw new UnauthorizedException('Usuário ou senha inválidos');
      }

      if (!user?.ativo) {
        throw new UnauthorizedException('Usuário desativado');
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
      restaurantCnpj: restaurant.cnpj,
      appToken: restaurant.appToken,
      role: user.role,
    });

    return {
      token,
      appToken: restaurant.appToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        restaurantCnpj: restaurantCnpj,
        nome: restaurant.name,
      },
    };
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username };
    return {
      username: user.username,
      nome: user.nome,
      restaurantCnpj: user.restaurantCnpj,
      access_token: this.jwtService.sign(payload),
    };
  }
}
