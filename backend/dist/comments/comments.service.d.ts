import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class CommentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(dto: CreateCommentDto, authorId: number): Promise<{
        id: number;
        content: string;
        authorId: number;
        postId: number;
        parentId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllByPostId(postId: number): Promise<({
        author: {
            id: number;
            email: string;
            department: {
                name: string;
            };
        };
        replies: ({
            author: {
                id: number;
                email: string;
                department: {
                    name: string;
                };
            };
        } & {
            id: number;
            content: string;
            authorId: number;
            postId: number;
            parentId: number | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: number;
        content: string;
        authorId: number;
        postId: number;
        parentId: number | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    update(id: number, dto: UpdateCommentDto, authorId: number): Promise<{
        id: number;
        content: string;
        authorId: number;
        postId: number;
        parentId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number, authorId: number): Promise<{
        id: number;
        content: string;
        authorId: number;
        postId: number;
        parentId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
