import { Expose, Transform } from 'class-transformer';
import { User } from '../../user/entities/user.entity';

export class CommentResponse {
  @Expose()
  id: number;
  @Expose()
  @Transform(({obj}) => obj.author.username)
  authorName: string;
  @Expose()
  content: string;
  
}