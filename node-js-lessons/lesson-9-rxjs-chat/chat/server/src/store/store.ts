import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs, constants } from 'node:fs';
import { UserDTO, ChatDTO, MessageDTO } from '../dto';
import { Mutex } from '../common/mutex';
import { DB_PATH, DB_DIR, DB_KEYS } from '../system/constants';

type DB = {
  users: UserDTO[];
  chats: ChatDTO[];
  messages: MessageDTO[];
};

const EMPTY_DB: DB = {
  [DB_KEYS.USERS]: [],
  [DB_KEYS.CHATS]: [],
  [DB_KEYS.MESSAGES]: [],
};

@Injectable()
export class Store implements OnModuleInit {
  private readonly mutex = new Mutex(DB_PATH);

  async onModuleInit() {
    const exists = await this.fileExists(DB_PATH);
    if (!exists) {
      await fs.mkdir(DB_DIR, { recursive: true });
      await this.write(EMPTY_DB);
      console.log('Created empty Database');
    }
  }

  async readByKey<K extends keyof DB>(key: K): Promise<DB[K]> {
    const db = await this.read();
    return db[key];
  }

  async writeByKey<K extends keyof DB>(key: K, value: DB[K]): Promise<void> {
    await this.mutex.runExclusive(async () => {
      const db = await this.read();
      db[key] = value;
      await this.write(db);
    });
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  private async read(): Promise<DB> {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  }

  private async write(db: DB): Promise<void> {
    const content = JSON.stringify(db, null, 2);
    await fs.writeFile(DB_PATH, content);
  }
}
