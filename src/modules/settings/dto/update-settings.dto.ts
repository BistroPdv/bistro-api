import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional({
    example: 'Restaurante XYZ',
    description: 'Nome do restaurante',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: '(11) 99999-9999',
    description: 'Telefone do restaurante',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: 'contato@restaurante.com',
    description: 'Email do restaurante',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Notificação de impressora',
  })
  @IsNotEmpty()
  printerNotification: string;

  @ApiPropertyOptional({ example: true, description: 'Impressão de conta' })
  @IsNotEmpty()
  printerBill: string;

  @ApiPropertyOptional({ example: 'OMIE', description: 'Integração com PDV' })
  @IsNotEmpty()
  @IsString()
  pdvIntegrations: string;

  @ApiPropertyOptional({
    example: '192.168.1.225',
    description: 'URL do servidor de impressão',
  })
  @IsNotEmpty()
  @IsString()
  printerServerUrl: string;

  @ApiPropertyOptional({
    example: 9100,
    description: 'Porta do servidor de impressão',
  })
  @IsNotEmpty()
  @IsNumber()
  printerServerPort: number;
}
