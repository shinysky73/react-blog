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
        status: import("generated/prisma").$Enums.Status;
        visibility: import("generated/prisma").$Enums.Visibility;
        authorId: number;
    }>;
    findAllPublic(): Promise<({
        author: {
            department: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
            email: string;
            id: number;
        };
        categories: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
        tags: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("generated/prisma").$Enums.Status;
        visibility: import("generated/prisma").$Enums.Visibility;
        authorId: number;
    })[]>;
    findAllForUser(req: Request): Promise<({
        categories: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
        tags: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("generated/prisma").$Enums.Status;
        visibility: import("generated/prisma").$Enums.Visibility;
        authorId: number;
    })[]>;
    findOne(id: number): Promise<({
        author: {
            department: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            email: string;
            password: string;
            departmentId: number;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        categories: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
        tags: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("generated/prisma").$Enums.Status;
        visibility: import("generated/prisma").$Enums.Visibility;
        authorId: number;
    }) | null>;
    update(id: number, updatePostDto: UpdatePostDto, req: Request): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("generated/prisma").$Enums.Status;
        visibility: import("generated/prisma").$Enums.Visibility;
        authorId: number;
    }>;
    remove(id: number, req: Request): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("generated/prisma").$Enums.Status;
        visibility: import("generated/prisma").$Enums.Visibility;
        authorId: number;
    }>;
}
