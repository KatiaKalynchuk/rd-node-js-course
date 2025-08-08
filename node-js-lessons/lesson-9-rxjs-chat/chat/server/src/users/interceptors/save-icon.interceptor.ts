import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { randomUUID } from 'node:crypto';
import { PUBLIC_ICONS_DIR } from '../../system/constants';

export function SaveUserIconInterceptor(fieldName: string) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: PUBLIC_ICONS_DIR,
      filename: (_req, file, callback) => {
        const uniqueName = `${fieldName}-${randomUUID()}${extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    }),
    fileFilter: (_req, file, callback) => {
      const allowedTypes = ['image/png', 'image/jpeg'];
      const isValid = allowedTypes.includes(file.mimetype);
      callback(null, isValid);
    },
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB
    },
  });
}
