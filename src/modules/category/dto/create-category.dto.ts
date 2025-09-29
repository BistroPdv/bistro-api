import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AdicionalDto } from './adicional.dto';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Lanches',
    description: 'Nome da categoria',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'https://exemplo.com/imagem-categoria.jpg',
    description: 'URL da imagem da categoria',
    required: false,
  })
  @IsOptional()
  @IsString()
  imagem?: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Cor da categoria em formato hexadecimal',
    required: false,
  })
  @IsOptional()
  @IsString()
  cor?: string;

  @ApiProperty({
    example: 0,
    description: 'Ordem de exibição da categoria',
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ordem?: number;

  @ApiProperty({
    example: false,
    description: 'Se a categoria tem promoção ativa',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  temPromocao?: boolean;

  @ApiProperty({
    example: 'CAT123456',
    description: 'ID externo da categoria (integração)',
    required: false,
  })
  @IsOptional()
  @IsString()
  externoId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da impressora associada à categoria',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  impressoraId?: string;

  @ApiProperty({
    example: '12345678000123',
    description: 'CNPJ do restaurante',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  restaurantCnpj: string;

  @ApiProperty({
    description: 'Adicionais da categoria',
    type: [AdicionalDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdicionalDto)
  adicionais?: AdicionalDto[];
}
