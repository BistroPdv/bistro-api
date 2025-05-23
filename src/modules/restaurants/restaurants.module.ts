import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [PrismaModule],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
