import { Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserPosts(username: string): Promise<Post[]> {
    console.log(
      '[post.service.ts-getUserPosts] routine start. username: ',
      username,
    );

    if (!username) throw new NotFoundException('로그인해야 사용 가능합니다');

    const records = await this.postRepository.find({
      where: { owner: { username: username } },
      relations: ['owner', 'author'],
    });

    console.log(`records : ${records}`);
    return records;
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    let username = createPostDto.authorName;
    const author = await this.userRepository.findOneBy({ username });

    username = createPostDto.ownerName;
    const owner = await this.userRepository.findOneBy({ username });

    if (!author || !owner)
      throw new NotFoundException('author or owner not found');

    const post = this.postRepository.create({
      author,
      owner,
      content: createPostDto.content,
    });
    return this.postRepository.save(post);
  }

  async update(id: number, attrs: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['owner', 'author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    Object.assign(post, attrs);
    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.remove(post);
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['owner', 'author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}


