import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor(partial: Partial<SignInResponseDTO>) {
    Object.assign(this, partial);
  }
}
