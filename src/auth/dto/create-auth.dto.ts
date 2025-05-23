import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ example: 'joao', description: 'Nome do usuário' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '00000000000000',
    description: 'CNPJ/CPF do restaurante',
  })
  @IsNotEmpty()
  cnpj: string;
}
