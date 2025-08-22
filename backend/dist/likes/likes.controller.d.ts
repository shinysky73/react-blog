import { LikesService } from './likes.service';
import type { Request } from 'express';
import { ToggleLikeDto } from './dto/toggle-like.dto';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    toggleLike(toggleLikeDto: ToggleLikeDto, req: Request): Promise<{
        liked: boolean;
    }>;
}
