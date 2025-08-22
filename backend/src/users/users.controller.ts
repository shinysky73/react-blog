import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    // req.user is populated by the JwtStrategy
    const user = req.user as { id: number; email: string };
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
