import { Controller, Get, Param, Post, Body, UnauthorizedException, Patch, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Session } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Serialize } from '../interceptor/response.interceptor';
import { PostResponse } from './dto/post.response';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiAdvice } from '../api/api.advice';

@Controller('post')
@ApiTags('롤링페이퍼')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly apiAdvice: ApiAdvice
  ) {}

  @Get()
  @Serialize(PostResponse)
  @ApiOperation({ summary: '내 포스트 조회' })
  @ApiResponse({ status: 200, description: '조회 성공', type: PostResponse })
  @ApiResponse({ status: 404, description: '로그인 필요' })
  getMyPosts(@Session() session) {
    console.log("/post")
    if (!session || session.username === undefined)
    {
      console.log("내 포스트 조회 : session undefined")
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');
    }
    const username = session.username;
    return this.postService.getUserPosts(username);
  }

  @Get(':id')
  @Serialize(PostResponse)
  @ApiOperation({ summary: '특정 포스트 조회' })
  @ApiResponse({ status: 200, description: '조회 성공', type: PostResponse })
  @ApiResponse({ status: 401, description: '로그인 필요' })
  @ApiResponse({ status: 404, description: '존재하지 않는 포스트' })
  async findOne(@Param('id') id: string, @Session() session) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    return this.postService.findOne(+id);
  }

  @Post()
  @Serialize(PostResponse)
  @ApiOperation({ summary: '포스트 생성' })
  @ApiResponse({ status: 201, description: '생성 성공', type: PostResponse })
  @ApiResponse({ status: 401, description: '로그인 필요' })
  @ApiResponse({ status: 404, description: '작성자 또는 소유자 없음' })
  createPost(@Body() body: CreatePostDto, @Session() session) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    return this.postService.createPost(body);
  }

  @Patch(':id')
  @Serialize(PostResponse)
  @ApiOperation({ summary: '포스트 수정' })
  @ApiResponse({ status: 200, description: '수정 성공', type: PostResponse })
  @ApiResponse({ status: 401, description: '로그인 필요 또는 권한 없음' })
  @ApiResponse({ status: 404, description: '존재하지 않는 포스트' })
  async updatePost(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @Session() session,
  ) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    let post = await this.postService.findOne(+id);

    if (post.owner.username !== session.username) {
      throw new UnauthorizedException(
        '본인의 포스트만 업데이트 할 수 있습니다',
      );
    }

    post = await this.postService.update(+id, body);

    return post;
  }

  @Delete(':id')
  @ApiOperation({ summary: '포스트 삭제' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 401, description: '로그인 필요 또는 권한 없음' })
  @ApiResponse({ status: 404, description: '존재하지 않는 포스트' })
  async removePost(@Param('id') id: string, @Session() session) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    const post = await this.postService.findOne(+id);

    if (post.owner.username !== session.username) {
      throw new UnauthorizedException('본인의 포스트만 삭제할 수 있습니다');
    }

    return this.postService.remove(+id);
  }

  @Post("/ai")
  @ApiOperation({summary : '주접글 생성'})
  createAiPost(@Session() session) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    return this.apiAdvice.getAdvice();
  }

}

/* Argument of type '{ content: string; userId: number; author: string; }'
 is not assignable to parameter of type 
 '{ id: number; author: User; owner: User; content: string; createAt: Date; }'.
 */