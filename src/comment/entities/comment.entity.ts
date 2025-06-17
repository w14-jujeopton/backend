import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=> Post, {eager: true} )
  post: Post;

  @ManyToOne(() => User, {eager: true} )
  author: User;

  @Column()
  content: string;
}
