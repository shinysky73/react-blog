import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
