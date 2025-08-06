import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum TipoPagamento {
  DINHEIRO = 'DINHEIRO',
  CARTAO = 'CARTAO',
  PIX = 'PIX',
  TICKET = 'TICKET',
  VOUCHER = 'VOUCHER',
  OUTROS = 'OUTROS',
}

export class CreatePaymentMethodDto {
  @ApiProperty({
    example: 'Cartão de Crédito',
    description: 'Nome do método de pagamento',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'CARTAO',
    description: 'Tipo do método de pagamento',
    enum: TipoPagamento,
  })
  @IsNotEmpty()
  @IsEnum(TipoPagamento)
  type: TipoPagamento;

  @ApiProperty({
    example: 'Aceita cartões de crédito e débito',
    description: 'Descrição do método de pagamento',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Se aceita troco',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  channel?: boolean;

  @ApiProperty({
    example: true,
    description: 'Status do método de pagamento',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    example: 0,
    description: 'Taxa do método de pagamento',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  taxa?: number;
}
