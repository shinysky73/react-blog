import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signUp(dto: AuthDto): Promise<{
        email: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: AuthDto): Promise<{
        accessToken: string;
    }>;
}
