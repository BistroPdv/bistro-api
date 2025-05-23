import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ example: 'CAIXA', description: 'Nome do banner' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: '192.168.1.225',
    description: 'Endereço IP do banner',
  })
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty({ example: 9100, description: 'Porta do banner' })
  @IsNotEmpty()
  @IsNumber()
  porta: number;

  @ApiProperty({
    example: '00000000000000',
    description: 'CNPJ/CPF do banner',
  })
  @IsNotEmpty()
  @IsString()
  restaurantCnpj: string;
}
