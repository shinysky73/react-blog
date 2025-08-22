"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const { title, content, categoryIds, tagNames, status, visibility } = dto;
        const tags = tagNames ? await this.upsertTags(tagNames) : [];
        return this.prisma.post.create({
            data: {
                title,
                content,
                status,
                visibility,
                authorId: userId,
                categories: {
                    connect: categoryIds.map((id) => ({ id })),
                },
                tags: {
                    connect: tags.map((tag) => ({ id: tag.id })),
                },
            },
        });
    }
    async findAllPublic(query) {
        const { page = 1, limit = 10, categoryId, keyword } = query;
        const skip = (page - 1) * limit;
        const where = {
            status: 'PUBLISHED',
            visibility: 'PUBLIC',
        };
        if (categoryId) {
            where.categories = {
                some: {
                    id: categoryId,
                },
            };
        }
        if (keyword) {
            where.OR = [
                { title: { contains: keyword, mode: 'insensitive' } },
                { content: { contains: keyword, mode: 'insensitive' } },
            ];
        }
        const [posts, total] = await this.prisma.$transaction([
            this.prisma.post.findMany({
                where,
                skip,
                take: limit,
                include: {
                    categories: true,
                    tags: true,
                    author: {
                        select: {
                            id: true,
                            email: true,
                            department: true,
                        },
                    },
                    _count: {
                        select: { likes: true },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.post.count({ where }),
        ]);
        return {
            data: posts,
            page,
            limit,
            total,
        };
    }
    async findAllForUser(userId) {
        return this.prisma.post.findMany({
            where: {
                authorId: userId,
            },
            include: {
                categories: true,
                tags: true,
                _count: {
                    select: { likes: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                categories: true,
                tags: true,
                author: {
                    include: {
                        department: true,
                    },
                },
                comments: {
                    where: { parentId: null },
                    include: {
                        author: {
                            select: { id: true, email: true, department: { select: { name: true } } },
                        },
                        replies: {
                            include: {
                                author: {
                                    select: { id: true, email: true, department: { select: { name: true } } },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
                _count: {
                    select: { likes: true },
                },
            },
        });
        if (!post)
            return null;
        let userHasLiked = false;
        if (userId) {
            const like = await this.prisma.like.findUnique({
                where: {
                    userId_postId: {
                        userId,
                        postId: id,
                    },
                },
            });
            userHasLiked = !!like;
        }
        return { ...post, userHasLiked };
    }
    async update(id, dto, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post || post.authorId !== userId) {
            throw new common_1.ForbiddenException('Access to resource denied');
        }
        const { categoryIds, tagNames, ...restDto } = dto;
        const tags = tagNames ? await this.upsertTags(tagNames) : [];
        return this.prisma.post.update({
            where: { id },
            data: {
                ...restDto,
                categories: categoryIds
                    ? { set: categoryIds.map((id) => ({ id })) }
                    : undefined,
                tags: tagNames
                    ? { set: tags.map((tag) => ({ id: tag.id })) }
                    : undefined,
            },
        });
    }
    async remove(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post || post.authorId !== userId) {
            throw new common_1.ForbiddenException('Access to resource denied');
        }
        return this.prisma.post.delete({
            where: { id },
        });
    }
    async upsertTags(tagNames) {
        return Promise.all(tagNames.map((name) => this.prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        })));
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map