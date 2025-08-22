import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import type { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: Request) {
    // req.user is populated by the JwtStrategy
    const user = req.user as { id: number; email: string };
    return this.usersService.findOne(user.id);
  }
}
