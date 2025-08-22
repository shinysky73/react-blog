import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    recipientId: number;
    senderId: number;
    postId: number;
    type: 'NEW_COMMENT' | 'NEW_LIKE';
  }) {
    // Do not create a notification if the user is interacting with their own post
    if (data.recipientId === data.senderId) {
      return;
    }
    return this.prisma.notification.create({ data });
  }

  async findAllForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { recipientId: userId },
      include: {
        sender: { select: { id: true, email: true } },
        post: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { id, recipientId: userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { recipientId: userId, read: false },
      data: { read: true },
    });
  }
}