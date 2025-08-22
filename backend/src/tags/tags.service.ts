import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tag } from '../../generated/prisma';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.TagCreateInput): Promise<Tag> {
    return this.prisma.tag.create({ data });
  }

  findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany();
  }

  findOne(id: number): Promise<Tag | null> {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.TagUpdateInput): Promise<Tag> {
    return this.prisma.tag.update({ where: { id }, data });
  }

  remove(id: number): Promise<Tag> {
    return this.prisma.tag.delete({ where: { id } });
  }
}