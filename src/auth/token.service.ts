import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { JwtPayload } from 'jsonwebtoken';

import { RefreshToken } from './entities/refresh-token.entity';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from './constants';
import { SignInResponseDTO } from './dto/sign-in-response.dto';

const BASE_OPTIONS: JwtSignOptions = {
  issuer: 'cesupa-auth-service',
};

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,

    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private async generateAccessToken(userId: string): Promise<string> {
    const opts: JwtSignOptions = {
      ...BASE_OPTIONS,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
      subject: userId,
    };

    return this.jwt.signAsync({}, opts);
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const tokenId = randomUUID();

    const opts: JwtSignOptions = {
      ...BASE_OPTIONS,
      expiresIn: REFRESH_TOKEN_EXPIRATION,
      subject: userId,
      jwtid: tokenId,
    };

    const jwt = await this.jwt.signAsync({}, opts);

    const { exp } = this.jwt.decode(jwt) as JwtPayload;

    if (!exp) {
      throw new BadRequestException('Invalid token');
    }

    await this.refreshTokenRepository.save({
      id: tokenId,
      user: { id: userId },
      revoked: false,
      expiresAt: new Date(exp * 1000),
    });

    return jwt;
  }

  public async issueJwtToken(userId: string): Promise<SignInResponseDTO> {
    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);

    return new SignInResponseDTO({
      accessToken,
      refreshToken,
    });
  }

  public async verifyToken(jwtToken: string): Promise<JwtPayload> {
    try {
      const decodedToken = await this.jwt.verifyAsync(jwtToken);
      return decodedToken as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private findNotRevokedToken(id: string) {
    return this.refreshTokenRepository
      .createQueryBuilder('token')
      .where('token.id = :id AND token.revoked = false', { id })
      .getOneOrFail();
  }

  public async revokeToken(tokenId: string) {
    const token = await this.findNotRevokedToken(tokenId);

    return this.refreshTokenRepository.save({
      ...token,
      revoked: true,
    });
  }

  public async revokeTokenByUser(userId: string) {
    const token = await this.refreshTokenRepository
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.user', 'user')
      .where('user.id = :userId AND token.revoked = false', { userId })
      .getOne();

    if (!token) {
      return;
    }

    await this.refreshTokenRepository.save({
      ...token,
      revoked: true,
    });
  }
}
