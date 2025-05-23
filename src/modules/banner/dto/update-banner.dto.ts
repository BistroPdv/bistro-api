import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBannerDto {
  @ApiProperty({ example: 'CAIXA', description: 'Nome da impressora' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: '192.168.1.225',
    description: 'Endereço IP da impressora',
  })
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty({ example: 9100, description: 'Porta da impressora' })
  @IsNotEmpty()
  @IsNumber()
  porta: number;

  @ApiProperty({
    example: '00000000000000',
    description: 'CNPJ/CPF do restaurante',
  })
  @IsNotEmpty()
  @IsString()
  restaurantCnpj: string;
}
