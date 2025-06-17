import { Expose, Transform } from 'class-transformer';

export class PostResponse {
  @Expose()
  id: number;
  @Expose()
  content: string;
  @Expose()
  @Transform(({obj}) => obj.author.username)
  authorName: string;
  @Expose()
  @Transform(({obj}) => obj.owner.username)
  ownerName: string;
}
