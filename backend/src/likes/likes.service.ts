import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async toggleLike(postId: number, userId: number) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (like) {
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return { liked: false };
    } else {
      const post = await this.prisma.post.findUnique({ where: { id: postId } });
      if (!post) {
        throw new Error('Post not found');
      }

      await this.prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      // Create notification for the post author
      this.notificationsService.create({
        recipientId: post.authorId,
        senderId: userId,
        postId,
        type: 'NEW_LIKE',
      });

      return { liked: true };
    }
  }
}
