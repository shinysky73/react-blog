import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: number): Promise<{
        department: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        email: string;
        departmentId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
