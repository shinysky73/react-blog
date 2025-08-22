import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signUp(dto: SignUpDto): Promise<{
        email: string;
        departmentId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
}
