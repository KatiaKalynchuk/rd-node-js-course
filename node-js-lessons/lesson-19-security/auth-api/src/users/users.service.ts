import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { Role } from '../types';

@Injectable()
export class UsersService {
  private users: UserDto[] = [];

  constructor() {
    this.users.push(
      {
        id: 1,
        email: 'thewitcher@test.com',
        roles: [Role.ADMIN],
        password: bcrypt.hashSync('123123', 12),
      },
      {
        id: 2,
        email: 'geralt@test.com',
        roles: [Role.USER],
        password: bcrypt.hashSync('qwerty', 12),
      },
    );
  }

  findByEmail(email: string): UserDto | undefined {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
