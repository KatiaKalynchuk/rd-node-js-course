import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import { SUPPORTED_IMAGE_EXTENSIONS } from '../system/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getRelativePath = (relativePath: string): string => {
  return resolve(__dirname, relativePath);
};

export const getAllImagePaths = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.name.startsWith('.')) { // hidden or system files
      return [];
    }

    if (entry.isDirectory()) {
      return getAllImagePaths(fullPath);
    } else if (SUPPORTED_IMAGE_EXTENSIONS.test(entry.name)) {
      return [fullPath];
    }
    return [];
  }));

  return files.flat();
};
