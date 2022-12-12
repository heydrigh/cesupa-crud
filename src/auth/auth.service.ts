import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from './token.service';

import { SignInDTO } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { SignInResponseDTO } from './dto/sign-in-response.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async signIn(params: SignInDTO): Promise<SignInResponseDTO> {
    const user = await this.usersService.findByEmail(params.email);

    const userPassword = user.password;

    const passwordMatch = await this.usersService.verifyPassword(
      userPassword,
      params.password,
    );

    const autheResponse = await this.tokenService.issueJwtToken(user.id);

    if (!passwordMatch) {
      throw new UnauthorizedException('password does not match');
    }
    return new SignInResponseDTO({
      accessToken: autheResponse.accessToken,
      refreshToken: autheResponse.refreshToken,
    });
  }

  async refresh(authorization: string): Promise<SignInResponseDTO> {
    const { jti: tokenId, sub: userId } = await this.tokenService.verifyToken(
      authorization,
    );

    if (!tokenId || !userId) {
      throw new BadRequestException('Invalid token');
    }

    await this.tokenService.revokeToken(tokenId);

    const user = await this.usersService.findOne(userId);

    return this.tokenService.issueJwtToken(user.id);
  }

  async verifyToken(authorization: string): Promise<UserDto> {
    const { sub: userId } = await this.tokenService.verifyToken(authorization);

    if (!userId) {
      throw new BadRequestException('Invalid token');
    }

    return this.usersService.findOne(userId);
  }
}
