import { PrismaService } from 'src/prisma/prisma.service';
export declare class LikesService {
    private prisma;
    constructor(prisma: PrismaService);
    toggleLike(postId: number, userId: number): Promise<{
        liked: boolean;
    }>;
}
