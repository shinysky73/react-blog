import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category } from '../../generated/prisma';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category | null>;
    update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category>;
    remove(id: number): Promise<Category>;
}
