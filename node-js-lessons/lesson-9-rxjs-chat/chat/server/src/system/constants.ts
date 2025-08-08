import { join } from 'path';

export const DB_DIR = './database';
export const DB_FILENAME = 'database.json';
export const DB_PATH = join(DB_DIR, DB_FILENAME);
export const PUBLIC_ICONS_DIR = './public/icons';

export enum DB_KEYS {
  USERS = 'users',
  CHATS = 'chats',
  MESSAGES = 'messages',
}
