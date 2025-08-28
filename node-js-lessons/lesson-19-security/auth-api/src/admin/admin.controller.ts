import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../types';

@Controller('admin')
export class AdminController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('metrics')
  getMetrics() {
    return { uptime: process.uptime(), users: 2 };
  }
}
