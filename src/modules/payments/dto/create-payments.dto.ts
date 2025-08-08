import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID do pedido associado ao pagamento',
  })
  @IsNotEmpty()
  @IsUUID()
  pedidoId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'ID do método de pagamento',
  })
  @IsNotEmpty()
  @IsUUID()
  paymentMethodId: string;

  @ApiProperty({
    example: 25.5,
    description: 'Valor do pagamento',
  })
  @IsNotEmpty()
  @IsNumber()
  valor: number;

  @ApiProperty({
    example: 2.5,
    description: 'Valor do troco (opcional)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  troco?: number;
}
