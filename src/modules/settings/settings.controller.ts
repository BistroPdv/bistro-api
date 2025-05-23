import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { WebsocketGateway } from '@/websocket/websocket.gateway';
import {
  Controller,
  Get,
  NotFoundException,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Configurações')
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Get()
  async findOne(@Req() req: FastifyRequest) {
    return this.settingsService.findSettings(req.user.restaurantCnpj);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Atualização de configurações',
    type: UpdateSettingsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Configurações atualizadas com sucesso',
    schema: {
      example: {
        cnpj: '00000000000000',
        name: 'João',
        phone: '1234567890',
        email: 'joao@teste.com',
        pdvIntegrations: 'OMIE',
        integrationOmie: {
          omie_key: '1234567890',
          omie_secret: '1234567890',
        },
        Banner: [
          {
            nome: 'João',
            url: 'https://joao.com',
          },
        ],
      },
    },
  })
  @Put()
  async update(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    try {
      const formData = await req.formData();

      const settings = await this.settingsService.updateSettings({
        cnpj: req.user.restaurantCnpj,
        formData,
      });

      if (!settings) {
        throw new NotFoundException('Nenhum dado encontrado');
      }

      // Emite evento via socket.io para notificar clientes sobre a atualização
      this.websocketGateway.server.emit(
        `settings:updated:${req.user.restaurantCnpj}`,
        settings,
      );

      return reply.status(200).send(settings);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return reply.status(404).send(error.message);
      }
      return reply.status(500).send('Erro interno');
    }
  }
}
