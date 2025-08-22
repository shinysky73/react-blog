import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/findAll-posts.dto';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePostDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
        isAnnouncement: boolean;
        authorId: number;
        viewCount: number;
    }>;
    findAllPublic(query: FindAllPostsDto): Promise<{
        data: ({
            _count: {
                likes: number;
            };
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
            status: import("../../generated/prisma").$Enums.Status;
            visibility: import("../../generated/prisma").$Enums.Visibility;
            isAnnouncement: boolean;
            authorId: number;
            viewCount: number;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    findAllForUser(userId: number): Promise<({
        _count: {
            comments: number;
            likes: number;
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
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
        isAnnouncement: boolean;
        authorId: number;
        viewCount: number;
    })[]>;
    findAllByAuthorId(authorId: number): Promise<({
        _count: {
            likes: number;
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
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
        isAnnouncement: boolean;
        authorId: number;
        viewCount: number;
    })[]>;
    findOne(id: number, userId?: number): Promise<{
        userHasLiked: boolean;
        comments: ({
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
        })[];
        _count: {
            likes: number;
        };
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
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
        isAnnouncement: boolean;
        authorId: number;
        viewCount: number;
    } | null>;
    update(id: number, dto: UpdatePostDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
        isAnnouncement: boolean;
        authorId: number;
        viewCount: number;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        status: import("../../generated/prisma").$Enums.Status;
        visibility: import("../../generated/prisma").$Enums.Visibility;
        isAnnouncement: boolean;
        authorId: number;
        viewCount: number;
    }>;
    private upsertTags;
}
