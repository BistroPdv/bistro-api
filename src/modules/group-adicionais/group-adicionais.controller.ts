import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { GroupAdicionaisService } from './group-adicionais.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Group Adicionais')
@Controller('group-adicionais')
export class GroupAdicionaisController {
  constructor(
    private readonly groupAdicionaisService: GroupAdicionaisService,
  ) {}

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: FastifyRequest) {
    return this.groupAdicionaisService.delete(id, req.user.restaurantCnpj);
  }
}
