import { NotificationsService } from './notifications.service';
import type { Request } from 'express';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAllForUser(req: Request): Promise<({
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
    markAllAsRead(req: Request): Promise<import("generated/prisma").Prisma.BatchPayload>;
    markAsRead(id: number, req: Request): Promise<import("generated/prisma").Prisma.BatchPayload>;
}
