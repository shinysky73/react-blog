import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { Request } from 'express';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, req: Request): Promise<{
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
    update(id: number, updateCommentDto: UpdateCommentDto, req: Request): Promise<{
        id: number;
        content: string;
        authorId: number;
        postId: number;
        parentId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number, req: Request): Promise<{
        id: number;
        content: string;
        authorId: number;
        postId: number;
        parentId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
