import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import type { Request } from 'express';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { FindAllPostsDto } from './dto/findAll-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  findAllPublic(@Query() query: FindAllPostsDto) {
    return this.postsService.findAllPublic(query);
  }

  @UseGuards(JwtGuard)
  @Get('my-posts')
  findAllForUser(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.postsService.findAllForUser(userId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as { id: number } | undefined;
    return this.postsService.findOne(id, user?.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id;
    return this.postsService.update(id, updatePostDto, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.postsService.remove(id, userId);
  }
}
