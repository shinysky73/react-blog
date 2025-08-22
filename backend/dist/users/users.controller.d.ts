import { UsersService } from './users.service';
import type { Request } from 'express';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: Request): Promise<{
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
