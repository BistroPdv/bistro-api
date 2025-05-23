import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async findAll(@Req() req: FastifyRequest) {
    return this.dashboardService.getDashboardData(req.user.restaurantCnpj);
  }
}
