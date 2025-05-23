import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Número da página', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = undefined;

  @ApiPropertyOptional({
    description: 'Filtros de busca dinâmica',
    example: { name: 'João' },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    // Se for string (caso venha diretamente como JSON), tenta converter
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return {}; // Se falhar, retorna um objeto vazio
      }
    }
    return value;
  })
  search?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'CNPJ do restaurante',
    example: '1234567890',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  cnpj: string;
}
