import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status, Visibility } from '../../../generated/prisma';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[];

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsEnum(Visibility)
  @IsOptional()
  visibility?: Visibility;

  @IsBoolean()
  @IsOptional()
  isAnnouncement?: boolean;
}
