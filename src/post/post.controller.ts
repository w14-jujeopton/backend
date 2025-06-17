import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Session } from '@nestjs/common';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get()
  getMyPosts(@Session() session ) {
    const username = session.username;
    return this.postService.getUserPosts(username);
  }


  @Post()
  createPost(@Body() createPostDto: {
    id: number;
    author: User;
    owner: User;
    content: string;
    createAt: Date;
  }): Promise<PostEntity> {
    return this.postService.createPost(createPostDto);
  }
}

/* Argument of type '{ content: string; userId: number; author: string; }'
 is not assignable to parameter of type 
 '{ id: number; author: User; owner: User; content: string; createAt: Date; }'.
 */