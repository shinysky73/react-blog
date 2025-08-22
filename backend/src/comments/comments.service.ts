import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommentDto, authorId: number) {
    const { content, postId, parentId } = dto;
    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        parentId,
      },
    });
  }

  async findAllByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId, parentId: null }, // Get top-level comments
      include: {
        author: {
          select: { id: true, email: true, department: { select: { name: true } } },
        },
        replies: { // Include replies
          include: {
            author: {
              select: { id: true, email: true, department: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: number, dto: UpdateCommentDto, authorId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== authorId) {
      throw new ForbiddenException('Access to resource denied');
    }
    return this.prisma.comment.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, authorId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== authorId) {
      throw new ForbiddenException('Access to resource denied');
    }
    return this.prisma.comment.delete({ where: { id } });
  }
}