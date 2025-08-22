import { PrismaService } from 'src/prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        recipientId: number;
        senderId: number;
        postId: number;
        type: 'NEW_COMMENT' | 'NEW_LIKE';
    }): Promise<{
        id: number;
        type: string;
        read: boolean;
        recipientId: number;
        senderId: number;
        postId: number;
        createdAt: Date;
    } | undefined>;
    findAllForUser(userId: number): Promise<({
        sender: {
            id: number;
            email: string;
        };
        post: {
            id: number;
            title: string;
        };
    } & {
        id: number;
        type: string;
        read: boolean;
        recipientId: number;
        senderId: number;
        postId: number;
        createdAt: Date;
    })[]>;
    markAsRead(id: number, userId: number): Promise<import("generated/prisma").Prisma.BatchPayload>;
    markAllAsRead(userId: number): Promise<import("generated/prisma").Prisma.BatchPayload>;
}
