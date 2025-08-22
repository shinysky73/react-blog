import { Status, Visibility } from '../../../generated/prisma';
export declare class UpdatePostDto {
    title?: string;
    content?: string;
    categoryIds?: number[];
    tagNames?: string[];
    status?: Status;
    visibility?: Visibility;
    isAnnouncement?: boolean;
}
