import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AdicionalOptionDto } from './adicional-option.dto';

export class AdicionalDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do adicional (opcional para criação)',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: 'Adicionais de Carne',
    description: 'Título do adicional',
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    example: 1,
    description: 'Quantidade mínima de opções que devem ser selecionadas',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  qtdMinima?: number;

  @ApiProperty({
    example: 1,
    description: 'Quantidade máxima de opções que podem ser selecionadas',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  qtdMaxima?: number;

  @ApiProperty({
    example: false,
    description: 'Se o adicional é obrigatório',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  obrigatorio?: boolean;

  @ApiProperty({
    example: true,
    description: 'Status do adicional (ativo/inativo)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    example: 0,
    description: 'Ordem de exibição do adicional',
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ordem?: number;

  @ApiProperty({
    description: 'Opções do adicional',
    type: [AdicionalOptionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdicionalOptionDto)
  opcoes: AdicionalOptionDto[];
}
