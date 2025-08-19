import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: number) {
    const { title, content } = dto;

    return this.prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.post.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
