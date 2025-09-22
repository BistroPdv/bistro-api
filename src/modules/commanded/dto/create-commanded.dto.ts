import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum StatusComanda {
  ABERTO = 'ABERTO',
  AGUARDANDO_PG = 'AGUARDANDO_PG',
  FECHADO = 'FECHADO',
}

export class CreateCommandedDto {
  @ApiProperty({
    example: 1,
    description: 'Número da comanda',
  })
  @IsOptional()
  @IsNumber()
  numero?: number;

  @ApiProperty({
    example: 'FECHADO',
    description: 'Status da comanda',
    enum: StatusComanda,
    default: StatusComanda.FECHADO,
  })
  @IsOptional()
  @IsEnum(StatusComanda)
  status?: StatusComanda;

  @ApiProperty({
    example: '12345678000195',
    description: 'CNPJ do restaurante',
  })
  @IsOptional()
  @IsString()
  restaurantCnpj: string;
}

export class CreateCommandedRangeDto {
  @ApiProperty({
    example: 1,
    description: 'Range de números de comandas',
  })
  @IsNotEmpty()
  of: number;

  @ApiProperty({
    example: 10,
    description: 'Número final do range de comandas',
  })
  @IsNotEmpty()
  @IsNumber()
  to: number;
}
