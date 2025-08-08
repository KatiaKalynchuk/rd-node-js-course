import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import { join } from 'path';
import { Store } from '../store/store';
import { UserDTO, CreatedUserDTO } from '../dto';
import { PUBLIC_ICONS_DIR, DB_KEYS } from '../system/constants';

@Injectable()
export class UsersService {
  constructor(private store: Store) {}

  async getAll() {
    const users = await this.store.readByKey(DB_KEYS.USERS);

    return users || [];
  }

  async create(data: CreatedUserDTO): Promise<UserDTO> {
    const users = await this.getAll();

    const user = {
      ...data,
      id: randomUUID(),
    };

    await this.store.writeByKey(DB_KEYS.USERS, [...users, user]);

    return user;
  }

  async getUserIcon(iconName: string) {
    const iconPath = join(PUBLIC_ICONS_DIR, iconName);

    const icon = await fs.readFile(iconPath).catch(() => null);

    if (!icon) {
      throw new NotFoundException('Icon not found');
    }

    return icon;
  }
}
