import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoggerService, UserSignedUpPayload } from './logger.service';

@Controller()
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @MessagePattern('events.notifications')
  async logNotifications(
    @Payload() message: { type: string; payload: UserSignedUpPayload },
  ) {
    await this.loggerService.handleEvent(message);
  }
}
