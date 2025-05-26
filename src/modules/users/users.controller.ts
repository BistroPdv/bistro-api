import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { CreateUserDto } from './dto/create-users.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: FastifyRequest,
  ) {
    return this.usersService.findAll({
      ...query,
      cnpj: req.user.restaurantCnpj,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.usersService.findOne(id, req.user.restaurantCnpj);
  }

  @ApiBody({
    description: 'Criação de usuário com avatar',
    type: CreateUserDto,
  })
  @Post()
  async create(@Req() req: FastifyRequest<{ Body: Prisma.UserCreateInput }>) {
    const { restaurantCnpj } = req.user;
    return this.usersService.create({
      username: req.body.username,
      password: req.body.password,
      nome: req.body.nome,
      email: req.body.email,
      role: req.body.role,
      restaurant: { connect: { cnpj: restaurantCnpj } },
    });
  }

  @Put(':id')
  async update(
    @Req() req: FastifyRequest<{ Body: Prisma.UserUpdateInput }>,
    @Param('id') id: string,
  ) {
    const { restaurantCnpj } = req.user;
    if (!id) {
      throw new BadRequestException('ID do usuário não informado');
    }
    return this.usersService.update(
      {
        id,
        username: req.body.username,
        password: req.body.password,
        nome: req.body.nome,
        email: req.body.email,
        role: req.body.role,
        restaurant: { connect: { cnpj: restaurantCnpj } },
      },
      id,
    );
  }

  @Patch(':id/active')
  async patchActive(@Req() req: FastifyRequest, @Param('id') id: string) {
    return this.usersService.toggleActive(req.user.restaurantCnpj, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
