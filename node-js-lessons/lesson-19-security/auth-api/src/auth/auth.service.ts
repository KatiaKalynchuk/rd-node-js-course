import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserDto } from '../users/dto/user.dto';
import { TokenPayload } from '../types';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from '../system/constants';

@Injectable()
export class AuthService {
  private readonly jwtAccessSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.jwtAccessSecret = this.configService.get('JWT_ACCESS_SECRET')!;
    this.jwtRefreshSecret = this.configService.get('JWT_REFRESH_SECRET')!;
  }

  private generateUserTokens({ sub, email, roles }: TokenPayload) {
    const payload: TokenPayload = { sub, email, roles };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtAccessSecret,
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  private validateToken(token: string, secret: string): TokenPayload {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret,
      });

      return payload;
    } catch (e: any) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  validateRefreshToken(token: string): TokenPayload {
    return this.validateToken(token, this.jwtRefreshSecret);
  }

  validateAccessToken(token: string): TokenPayload {
    return this.validateToken(token, this.jwtAccessSecret);
  }

  async validateUser(email: string, password: string) {
    const user = this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login({ email, password }: LoginAuthDto) {
    const user = await this.validateUser(email, password);

    const { accessToken, refreshToken } = this.generateUserTokens({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });

    const userDto = plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });

    return { accessToken, refreshToken, user: userDto };
  }

  refresh(refreshToken: string) {
    const payload = this.validateRefreshToken(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } =
      this.generateUserTokens(payload);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
