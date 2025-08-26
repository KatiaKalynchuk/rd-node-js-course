import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { AppLogger } from '../logger/logger.service';

@Injectable()
@Catch(BadRequestException)
export class HttpValidationFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const exceptionResponse = exception.getResponse();

    const status = exception.getStatus();
    const payload = exception.getResponse();
    this.logger.error('Validation error', { status, payload });

    const response = ctx.getResponse();
    response.status(status).json(exceptionResponse);
  }
}
