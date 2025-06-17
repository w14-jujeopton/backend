import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment) private repo: Repository<Comment>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
    ) {
  }

  async create(authorName:string, postId:number, content:string) {
    const author = await this.userRepo.findOneBy({username: authorName});
    if(!author)
        throw new NotFoundException("해당 멤버를 찾을수 없습니다")

    const post = await this.postRepo.findOneBy({id: postId});
    if(!post)
      throw new NotFoundException('해당 포스트를 찾을 수 없습니다');

    const comment = this.repo.create({author, post, content});

    return this.repo.save(comment);
  }

  findAll() {
    return this.repo.find({
      relations: ['author', 'post'],
    });
  }

  async findAllByAuthor(authorName: string) {
    const author = await this.userRepo.findOneBy({username: authorName});
    if(!author)
      throw new NotFoundException("해당 멤버를 찾을수 없습니다")

    return this.repo.find({
      where: { author: { username: author.username } },
      relations: ['post'],
    });
  }

  async findAllByPost(id: number) {
    const post = await this.postRepo.findOneBy({ id });
    if(!post)
      throw new NotFoundException("해당 포스트를 찾을 수 없습니다")

    return this.repo.find({
      where: { post : { id : id } },
      relations: ['author']
    })
  }

  findOne(id: number) {
    if(!id)
      throw new NotFoundException("id가 null일 수 없습니다")
    return this.repo.findOneBy({id});
  }

  async update(id: number, attrs: Partial<Comment>, authorName: string) {
    const comment = await this.findOne(id);
    if (!comment)
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다');
    

    if(comment.author.username !== authorName)
      throw new UnauthorizedException("해당 댓글의 주인만 수정할 수 있습니다")

    Object.assign(comment, attrs);

    return this.repo.save(comment);
  }

  async remove(id: number, authorName: string) {
    let comment = await this.findOne(id);
    if(!comment)
      throw new NotFoundException("해당 댓글을 찾을 수 없습니다")

    if(comment.author.username !== authorName)
      throw new UnauthorizedException("해당 댓글의 주인만 삭제할 수 있습니다")

    return this.repo.remove(comment);
  }
}
