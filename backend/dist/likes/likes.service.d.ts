import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class LikesService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    toggleLike(postId: number, userId: number): Promise<{
        liked: boolean;
    }>;
}
