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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let CommentsService = class CommentsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(dto, authorId) {
        const { content, postId, parentId } = dto;
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new common_1.ForbiddenException('Post not found');
        }
        const comment = await this.prisma.comment.create({
            data: {
                content,
                postId,
                authorId,
                parentId,
            },
        });
        this.notificationsService.create({
            recipientId: post.authorId,
            senderId: authorId,
            postId,
            type: 'NEW_COMMENT',
        });
        return comment;
    }
    async findAllByPostId(postId) {
        return this.prisma.comment.findMany({
            where: { postId, parentId: null },
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
        });
    }
    async update(id, dto, authorId) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment || comment.authorId !== authorId) {
            throw new common_1.ForbiddenException('Access to resource denied');
        }
        return this.prisma.comment.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id, authorId) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment || comment.authorId !== authorId) {
            throw new common_1.ForbiddenException('Access to resource denied');
        }
        return this.prisma.comment.delete({ where: { id } });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map