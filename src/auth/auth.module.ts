import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserVerification } from './entities/user-verification.entity';
import { TokenService } from './token.service';
import { ConfigurationModule } from '../config/configuration.module';
import { JWT_SECRET_KEY } from './constants';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([RefreshToken, UserVerification]),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '5m',
      },
    }),

    ConfigurationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
