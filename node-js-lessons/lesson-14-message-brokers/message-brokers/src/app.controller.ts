import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification/notification.service';

@Controller()
export class AppController {
  constructor(private readonly notifications: NotificationService) {}

  @Post('signup')
  async signup(@Body() body: { id: string; email: string, event: string }) {
    await this.notifications.sendUserSignedUpEvent(body);
    return { status: 'UserSignedUp event sent' };
  }
}

