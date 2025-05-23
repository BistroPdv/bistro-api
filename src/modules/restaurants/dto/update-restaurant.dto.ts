import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateRestaurantDto {
  @ApiPropertyOptional({ example: 'joao', description: 'Nome do usuário' })
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    example: 'João',
    description: 'Nome completo do usuário',
  })
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({ example: '123456', description: 'Senha do usuário' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: 'joao@teste.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'USER', description: 'Role do usuário' })
  @IsNotEmpty()
  role: Role;
}
