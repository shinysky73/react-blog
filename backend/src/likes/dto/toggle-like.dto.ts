import { IsInt, IsNotEmpty } from 'class-validator';

export class ToggleLikeDto {
  @IsInt()
  @IsNotEmpty()
  postId: number;
}
