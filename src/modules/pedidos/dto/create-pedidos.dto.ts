import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreatePedidosDto {
  @ApiProperty({
    example: 'X-Burger Especial',
    description: 'Nome do produto',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'Hambúrguer artesanal com queijo, bacon e molho especial',
    description: 'Descrição detalhada do produto',
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({
    example: 29.9,
    description: 'Preço do produto',
  })
  @IsNotEmpty()
  @IsNumber()
  preco: number;

  @ApiProperty({
    example: '123456789',
    description: 'ID externo do produto (integração)',
  })
  @IsNotEmpty()
  @IsString()
  externoId: string;

  @ApiProperty({
    example: 'https://exemplo.com/imagem-produto.jpg',
    description: 'URL da imagem do produto',
  })
  @IsNotEmpty()
  @IsUrl()
  imagem: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da categoria do produto',
  })
  @IsNotEmpty()
  @IsUUID()
  categoriaId: string;

  @ApiProperty({
    example: '12345678000199',
    description: 'CNPJ do restaurante',
  })
  @IsNotEmpty()
  @IsString()
  restaurantCnpj: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo do produto',
    required: false,
  })
  @IsOptional()
  file?: File;
}
