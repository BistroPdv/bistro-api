import { ApiOmieService } from '@/common/services/api-omie.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [PrismaModule],
  controllers: [IntegrationsController],
  exports: [IntegrationsService],
  providers: [IntegrationsService, ApiOmieService],
})
export class IntegrationsModule {}
