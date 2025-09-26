import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: '12345678000123',
    description: 'CNPJ do restaurante',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter exatamente 14 dígitos' })
  cnpj: string;

  @ApiProperty({
    example: 'Restaurante Delícias',
    description: 'Nome do restaurante',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '(11) 99999-9999',
    description: 'Telefone do restaurante',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'contato@restaurante.com',
    description: 'Email do restaurante',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: true, description: 'Se o restaurante emite NFE' })
  @IsBoolean()
  @IsNotEmpty()
  nfe: boolean;
}
