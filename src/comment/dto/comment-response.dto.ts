import { Expose } from 'class-transformer';
import { User } from '../../user/entities/user.entity';

export class CommentResponse {
  @Expose()
  id: number;
  @Expose()
  author_name: string;
  @Expose()
  content: string;


  constructor(id: number, author: User, content: string) {
    this.id = id;
    this.author_name = author.username;
    this.content = content;
  }
}