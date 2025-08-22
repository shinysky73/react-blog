import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePostDto, userId: number): Promise<{
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
    findAllForUser(userId: number): Promise<({
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
    update(id: number, dto: UpdatePostDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("generated/prisma").$Enums.Status;
        visibility: import("generated/prisma").$Enums.Visibility;
        authorId: number;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("generated/prisma").$Enums.Status;
        visibility: import("generated/prisma").$Enums.Visibility;
        authorId: number;
    }>;
    private upsertTags;
}
