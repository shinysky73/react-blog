import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import type { Request } from 'express';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: Request): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        authorId: number;
    }>;
    findAllForUser(req: Request): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        authorId: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        authorId: number;
    } | null>;
    update(id: number, updatePostDto: UpdatePostDto, req: Request): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        authorId: number;
    }>;
    remove(id: number, req: Request): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        authorId: number;
    }>;
}
