import { Controller, Get, Patch, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import type { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAllForUser(@Req() req: Request) {
    const user = req.user as { id: number };
    return this.notificationsService.findAllForUser(user.id);
  }

  @Patch('read/all')
  markAllAsRead(@Req() req: Request) {
    const user = req.user as { id: number };
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.notificationsService.markAsRead(id, user.id);
  }
}