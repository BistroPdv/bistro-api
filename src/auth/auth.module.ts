import { UsersModule } from '@/modules/users/users.module';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RestaurantsModule } from '../modules/restaurants/restaurants.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtInterceptor } from './jwt.interceptor';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
    RestaurantsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtInterceptor],
  exports: [JwtInterceptor],
})
export class AuthModule {}
