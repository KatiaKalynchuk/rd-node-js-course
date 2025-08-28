import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserDto } from '../users/dto/user.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { getCredentialsFromBasicHeader } from '../utils/getCredentialsFromBasicHeader';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(
    @Headers('authorization') authHeader?: string,
    @Body() loginAuthDto?: LoginAuthDto,
  ) {
    const credentials = authHeader
      ? getCredentialsFromBasicHeader(authHeader)
      : loginAuthDto;

    return this.authService.login(credentials as LoginAuthDto);
  }

  @Post('refresh')
  refresh(@Body() { refreshToken }: RefreshAuthDto) {
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req) {
    return plainToInstance(UserDto, req.user, {
      excludeExtraneousValues: true,
    });
  }
}
