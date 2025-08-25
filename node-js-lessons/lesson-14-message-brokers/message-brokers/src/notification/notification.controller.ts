// import { Controller, Post, Body } from '@nestjs/common';
// import { NotificationService } from './notification.service';
//
// @Controller()
// export class NotificationController {
//   constructor(private readonly notificationService: NotificationService) {}
//
//   //Consumer
//   @Post('signup')
//   async signUp(@Body() body: { id: string; email: string }) {
//     await this.notificationService.sendUserSignedUpEvent(body);
//     return { message: 'UserSignedUp event sent' };
//   }
// }