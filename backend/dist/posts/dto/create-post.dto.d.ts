import { Status, Visibility } from '../../../generated/prisma';
export declare class CreatePostDto {
    title: string;
    content?: string;
    categoryIds: number[];
    tagNames?: string[];
    status?: Status;
    visibility?: Visibility;
}
