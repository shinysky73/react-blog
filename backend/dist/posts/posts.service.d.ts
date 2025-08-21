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
        authorId: number;
    }>;
    findAllForUser(userId: number): Promise<{
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
    update(id: number, dto: UpdatePostDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        authorId: number;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        authorId: number;
    }>;
}
