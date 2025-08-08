import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PUBLIC_ICONS_DIR } from '../../system/constants';

@Injectable()
export class AddIconUrlToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const file = req.file;

    if (file) {
      req.body.iconUrl = `${PUBLIC_ICONS_DIR}/${file.filename}`;
    }

    return next.handle();
  }
}
