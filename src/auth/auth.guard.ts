import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';

const USER_ID_HEADER = 'user-id';
const AUTHORIZATION = 'authorization';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let userId: string | undefined;
    if (request.header(USER_ID_HEADER)) {
      userId = request.header(USER_ID_HEADER);
    } else if (request.header(AUTHORIZATION)) {
      const authorization = request.header(AUTHORIZATION);
      const accessToken = authorization.replace('Bearer ', '');
      const { sub } = await this.tokenService.verifyToken(accessToken);
      userId = sub;
    }

    if (!userId) {
      throw new UnauthorizedException();
    }

    request.user = { id: userId };

    return true;
  }
}
