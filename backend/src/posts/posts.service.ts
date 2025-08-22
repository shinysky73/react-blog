import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: number) {
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

  async findAllPublic() {
    return this.prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
      },
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        categories: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
        author: {
          include: {
            department: true,
          },
        },
      },
    });
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
