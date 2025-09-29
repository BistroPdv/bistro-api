import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdicionalOptionDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da opção (opcional para criação)',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: 'EXTRA_QUEIJO',
    description: 'Código de integração da opção',
    required: false,
  })
  @IsOptional()
  @IsString()
  codIntegra?: string;

  @ApiProperty({
    example: 'Queijo Extra',
    description: 'Nome da opção',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: 5.5,
    description: 'Preço da opção',
  })
  @IsNotEmpty()
  @IsNumber()
  preco: number;

  @ApiProperty({
    example: true,
    description: 'Status da opção (ativo/inativo)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
