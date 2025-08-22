import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tag } from '../../generated/prisma';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.TagCreateInput): Promise<Tag>;
    findAll(): Promise<Tag[]>;
    findOne(id: number): Promise<Tag | null>;
    update(id: number, data: Prisma.TagUpdateInput): Promise<Tag>;
    remove(id: number): Promise<Tag>;
}
