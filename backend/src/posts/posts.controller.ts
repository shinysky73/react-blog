import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import type { Request } from 'express';
import { UpdatePostDto } from './dto/update-post.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  findAllForUser(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.postsService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id;
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.postsService.remove(id, userId);
  }
}
