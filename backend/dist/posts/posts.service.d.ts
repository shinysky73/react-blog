import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/findAll-posts.dto';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePostDto, userId: number): Promise<{
        id: number;
        title: string;
        content: string | null;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
    }>;
    findAllPublic(query: FindAllPostsDto): Promise<{
        data: ({
            author: {
                id: number;
                email: string;
                department: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                };
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
            _count: {
                likes: number;
            };
        } & {
            id: number;
            title: string;
            content: string | null;
            authorId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../generated/prisma").$Enums.Status;
            visibility: import("../../generated/prisma").$Enums.Visibility;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
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
        _count: {
            likes: number;
        };
    } & {
        id: number;
        title: string;
        content: string | null;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
    })[]>;
    findOne(id: number, userId?: number): Promise<{
        userHasLiked: boolean;
        author: {
            department: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            departmentId: number;
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
        comments: ({
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
                createdAt: Date;
                updatedAt: Date;
                parentId: number | null;
                postId: number;
            })[];
        } & {
            id: number;
            content: string;
            authorId: number;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
            postId: number;
        })[];
        _count: {
            likes: number;
        };
        id: number;
        title: string;
        content: string | null;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
    } | null>;
    update(id: number, dto: UpdatePostDto, userId: number): Promise<{
        id: number;
        title: string;
        content: string | null;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        title: string;
        content: string | null;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
    }>;
    private upsertTags;
}
