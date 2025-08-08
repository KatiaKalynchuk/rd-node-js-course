import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreatedUserDTO, UserDTO } from '../dto';
import { UsersService } from './users.service';
import { SaveUserIconInterceptor } from './interceptors/save-icon.interceptor';
import { AddIconUrlToBodyInterceptor } from './interceptors/add-icon-url.interceptor';

@Controller('/api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseInterceptors(SaveUserIconInterceptor('icon'), AddIconUrlToBodyInterceptor)
  async createUser(@Body() data: CreatedUserDTO): Promise<UserDTO> {
    return this.usersService.create(data);
  }

  @Get()
  async list(): Promise<{ items: UserDTO[]; total: number }> {
    const items = await this.usersService.getAll();

    return {
      items,
      total: items.length,
    };
  }

  @Get('icons/:iconPath')
  async icon(@Param('iconPath') iconPath: string) {
    return this.usersService.getUserIcon(iconPath);
  }
}
