import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import type { Request } from 'express';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: Request): Promise<{
        title: string;
        content: string | null;
        id: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllForUser(req: Request): Promise<{
        title: string;
        content: string | null;
        id: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        title: string;
        content: string | null;
        id: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: number, updatePostDto: UpdatePostDto, req: Request): Promise<{
        title: string;
        content: string | null;
        id: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number, req: Request): Promise<{
        title: string;
        content: string | null;
        id: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
