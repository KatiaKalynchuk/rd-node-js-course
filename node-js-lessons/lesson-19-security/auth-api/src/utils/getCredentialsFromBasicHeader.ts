import { UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from '../auth/dto/login-auth.dto';

export const getCredentialsFromBasicHeader = (
  authHeader: string,
): LoginAuthDto => {
  const [authType, authToken] = authHeader.split(' ');

  if (authType !== 'Basic' || !authToken) {
    throw new UnauthorizedException('Invalid authorization header');
  }

  const decodedToken = Buffer.from(authToken, 'base64').toString('utf-8');

  const [email, password] = decodedToken.split(':');

  if (!email || !password) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return { email, password };
};
