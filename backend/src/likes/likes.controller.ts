import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import type { Request } from 'express';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@UseGuards(JwtGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  toggleLike(@Body() toggleLikeDto: ToggleLikeDto, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.likesService.toggleLike(toggleLikeDto.postId, user.id);
  }
}