import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'joao', description: 'Nome do usuário' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'João', description: 'Nome completo do usuário' })
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'joao@teste.com', description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'USER', description: 'Role do usuário' })
  @IsNotEmpty()
  role: Role;
}
