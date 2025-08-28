import { IsJWT } from 'class-validator';

export class RefreshAuthDto {
  @IsJWT()
  refreshToken: string;
}
