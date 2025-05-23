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

class AdicionalOptionDto {
  @ApiProperty({
    description: 'ID da opção',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Código de integração',
    required: false,
  })
  @IsOptional()
  @IsString()
  codIntegra?: string;

  @ApiProperty({
    description: 'Nome da opção',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Preço da opção',
  })
  @IsNotEmpty()
  @IsString()
  preco: string;

  @ApiProperty({
    description: 'Status da opção',
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

class AdicionalDto {
  @ApiProperty({
    description: 'ID do adicional',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Título do adicional',
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Quantidade mínima',
  })
  @IsNotEmpty()
  @IsNumber()
  qtdMinima: number;

  @ApiProperty({
    description: 'Quantidade máxima',
  })
  @IsNotEmpty()
  @IsNumber()
  qtdMaxima: number;

  @ApiProperty({
    description: 'Se é obrigatório',
  })
  @IsNotEmpty()
  @IsBoolean()
  obrigatorio: boolean;

  @ApiProperty({
    description: 'Status do adicional',
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'Opções do adicional',
    type: [AdicionalOptionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdicionalOptionDto)
  opcoes: AdicionalOptionDto[];
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'ID da categoria',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Nome da categoria',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Cor da categoria',
  })
  @IsNotEmpty()
  @IsString()
  cor: string;

  @ApiProperty({
    description: 'ID da impressora',
  })
  @IsNotEmpty()
  @IsUUID()
  impressoraId: string;

  @ApiProperty({
    description: 'Status da categoria',
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'Adicionais da categoria',
    type: [AdicionalDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdicionalDto)
  adicionais: AdicionalDto[];
}
