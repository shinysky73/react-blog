import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Department } from '../../generated/prisma';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.DepartmentCreateInput): Promise<Department>;
    findAll(): Promise<Department[]>;
    findOne(id: number): Promise<Department | null>;
    update(id: number, data: Prisma.DepartmentUpdateInput): Promise<Department>;
    remove(id: number): Promise<Department>;
}
