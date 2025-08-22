import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCommentDto, authorId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: number;
        parentId: number | null;
        postId: number;
    }>;
    findAllByPostId(postId: number): Promise<({
        author: {
            department: {
                name: string;
            };
            email: string;
            id: number;
        };
        replies: ({
            author: {
                department: {
                    name: string;
                };
                email: string;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: number;
            parentId: number | null;
            postId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: number;
        parentId: number | null;
        postId: number;
    })[]>;
    update(id: number, dto: UpdateCommentDto, authorId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: number;
        parentId: number | null;
        postId: number;
    }>;
    remove(id: number, authorId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: number;
        parentId: number | null;
        postId: number;
    }>;
}
