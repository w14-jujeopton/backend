import { Expose } from 'class-transformer';

export class PostResponse {
  @Expose()
  id: number;
  @Expose()
  content: string;
  @Expose()
  authorName: string;
  @Expose()
  ownerName: string;
}
