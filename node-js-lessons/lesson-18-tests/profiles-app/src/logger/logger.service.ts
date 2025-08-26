import { Injectable } from '@nestjs/common';

@Injectable()
export class AppLogger {
  log(message: string, meta: any) {
    console.log('Info', message, meta);
  }

  error(message: string, meta: any) {
    console.error('Error', message, meta);
  }
}
