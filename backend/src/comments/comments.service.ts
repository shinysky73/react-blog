import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateCommentDto, authorId: number) {
    const { content, postId, parentId } = dto;

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    const comment = await this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        parentId,
      },
    });

    // Create notification for the post author
    this.notificationsService.create({
      recipientId: post.authorId,
      senderId: authorId,
      postId,
      type: 'NEW_COMMENT',
    });

    return comment;
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