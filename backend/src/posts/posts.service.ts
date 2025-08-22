import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/findAll-posts.dto';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: number) {
    const { title, content, categoryIds, tagNames, status, visibility, isAnnouncement } = dto;

    const tags = tagNames ? await this.upsertTags(tagNames) : [];

    return this.prisma.post.create({
      data: {
        title,
        content,
        status,
        visibility,
        isAnnouncement,
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

  async findAllPublic(query: FindAllPostsDto) {
    const { page = 1, limit = 10, categoryId, keyword } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
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
        orderBy: [
          { isAnnouncement: 'desc' },
          { createdAt: 'desc' },
        ],
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

  async findAllForUser(userId: number) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        categories: true,
        tags: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllByAuthorId(authorId: number) {
    return this.prisma.post.findMany({
      where: {
        authorId,
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
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

  async findOne(id: number, userId?: number) {
    const [post] = await this.prisma.$transaction([
      this.prisma.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
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
      }),
    ]);

    if (!post) return null;

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

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException('Access to resource denied');
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

  async remove(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  private async upsertTags(tagNames: string[]) {
    return Promise.all(
      tagNames.map((name) =>
        this.prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );
  }
}
