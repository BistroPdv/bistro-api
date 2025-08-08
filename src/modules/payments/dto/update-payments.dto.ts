import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @ApiProperty({ example: 1, description: 'Número da mesa' })
  @IsNotEmpty()
  @IsNumber()
  numero: number;

  @ApiProperty({
    example: null,
    description: 'Número final para criar múltiplas mesas',
  })
  @IsOptional()
  @IsNumber()
  endNumber?: number;

  @ApiProperty({ example: 0, description: 'Capacidade da mesa' })
  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: '', description: 'Localização da mesa' })
  @IsNotEmpty()
  @IsString()
  location: string;
}
