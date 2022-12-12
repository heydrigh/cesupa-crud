import { Controller, Post, Body, Headers, UseFilters } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInResponseDTO } from './dto/sign-in-response.dto';
import { SignInDTO } from './dto/sign-in.dto';
import { AuthExceptionFilter } from './filters/auth-exception.filters';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOkResponse({ type: SignInResponseDTO })
  signIn(@Body() params: SignInDTO): Promise<SignInResponseDTO> {
    return this.authService.signIn(params);
  }

  @Post('refresh')
  @UseFilters(new AuthExceptionFilter())
  @ApiOkResponse({ type: SignInResponseDTO })
  refresh(
    @Headers('authorization') authorization: string,
  ): Promise<SignInResponseDTO> {
    const accessToken = authorization.replace('Bearer ', '');
    return this.authService.refresh(accessToken);
  }
}
