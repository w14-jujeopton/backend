import { Controller, Get, Param, Post, Body, UnauthorizedException, Patch, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Session } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Serialize } from '../interceptor/response.interceptor';
import { PostResponse } from './dto/post.response';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  @Get()
  @Serialize(PostResponse)
  getMyPosts(@Session() session) {
    const username = session.username;
    return this.postService.getUserPosts(username);
  }

  @Get(':id')
  @Serialize(PostResponse)
  async findOne(@Param('id') id: string, @Session() session) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    return this.postService.findOne(+id);
  }

  @Post()
  @Serialize(PostResponse)
  createPost(@Body() body: CreatePostDto, @Session() session) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException("로그인하지 않으면 사용할 수 없습니다");

    console.log(body)
    
    return this.postService.createPost(body);
  };

  @Patch(':id')
  @Serialize(PostResponse)
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostDto, @Session() session) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    let post = await this.postService.findOne(+id);

    if (post.owner.username !== session.username) {
      throw new UnauthorizedException('본인의 포스트만 업데이트 할 수 있습니다');
    }

    post = await this.postService.update(+id, body);

    return post;
  }

  @Delete(':id')
  async removePost(@Param('id') id: string, @Session() session) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    const post = await this.postService.findOne(+id);

    if (post.owner.username !== session.username) {
      throw new UnauthorizedException('본인의 포스트만 삭제할 수 있습니다');
    }

    return this.postService.remove(+id);
  }
}

/* Argument of type '{ content: string; userId: number; author: string; }'
 is not assignable to parameter of type 
 '{ id: number; author: User; owner: User; content: string; createAt: Date; }'.
 */