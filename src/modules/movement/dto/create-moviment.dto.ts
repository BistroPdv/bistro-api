import { ApiProperty } from '@nestjs/swagger';
import { TipoMovimentacao } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovementDto {
  @ApiProperty({
    example: 100,
    description: 'Valor da movimentação',
  })
  @IsNotEmpty()
  @IsNumber()
  valor: number;

  @ApiProperty({
    example: 'ENTRADA',
    description: 'Tipo da movimentação',
  })
  @IsNotEmpty()
  @IsEnum(TipoMovimentacao)
  tipo: TipoMovimentacao;

  @ApiProperty({
    example: 'Observação da movimentação',
    description: 'Observação da movimentação',
  })
  @IsOptional()
  @IsString()
  obs?: string;
}
