import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  authorName: string;
  @IsString()
  ownerName: string;
  @IsString()
  content: string;
}
