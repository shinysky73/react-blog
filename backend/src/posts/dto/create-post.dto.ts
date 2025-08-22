import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status, Visibility } from '../../../generated/prisma';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

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
}
