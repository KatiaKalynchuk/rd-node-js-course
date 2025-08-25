import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('signup')
  async handleUserSignup(@Body() user: { id: string; email: string }) {
    await this.notificationService.sendUserSignedUpEvent(user);
    return { status: 'UserSignedUp event sent' };
  }
}
