import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePostDto, userId: number): Promise<{
        title: string;
        content: string | null;
        id: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllForUser(userId: number): Promise<{
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
    update(id: number, dto: UpdatePostDto, userId: number): Promise<{
        title: string;
        content: string | null;
        id: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number, userId: number): Promise<{
        title: string;
        content: string | null;
        id: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
