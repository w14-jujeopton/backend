import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getUserPosts(thisUserName: string): Promise<Post[]> {
    console.log("[post.service.ts-getUserPosts] routine start. thisUserName: ", thisUserName)
    return this.postRepository.find({
      where: { owner: { username: thisUserName } },
      relations: ['owner'],
    });
  }

  async createPost(createPostDto: {
    id: number,
    author: User,
    owner: User,
    content: string,
    createAt: Date,
  }): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      owner: { id: createPostDto.userId },
    });
    return this.postRepository.save(post);
  }
}


