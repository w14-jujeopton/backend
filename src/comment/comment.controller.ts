import { Controller, Get, Post, Body, Patch, Param, Delete, Session, UnauthorizedException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../interceptor/response.interceptor';
import { CommentResponse } from './dto/comment-response.dto';

@Controller('comment')
@ApiTags('댓글')
@Serialize(CommentResponse)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:post_id')
  @ApiOperation({
    summary: '댓글 작성',
    description: '포스트에 댓글을 작성합니다',
  })
  @ApiParam({ name: 'post_id', description: '포스트 ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: '댓글 작성 성공' })
  @ApiResponse({
    status: 404,
    description: '포스트 또는 작성자를 찾을 수 없음',
  })
  create(
    @Param('post_id') id: number,
    @Session() session: any,
    @Body() dto: CreateCommentDto,
  ) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    const authorName = session.username;
    return this.commentService.create(authorName, id, dto.content);
  }

  @Get()
  @ApiOperation({
    summary: '전체 댓글 조회',
    description: '모든 댓글을 조회합니다',
  })
  @ApiResponse({ status: 200, description: '조회 성공' })
  findAll() {
    return this.commentService.findAll();
  }

  @Get('/:post_id')
  @ApiOperation({
    summary: '포스트별 댓글 조회',
    description: '특정 포스트의 모든 댓글을 조회합니다',
  })
  @ApiParam({ name: 'post_id', description: '포스트 ID' })
  @ApiResponse({ status: 200, description: '조회 성공' , type: CommentResponse})
  @ApiResponse({ status: 404, description: '포스트를 찾을 수 없음' })
  findAllByPost(@Param('post_id') id: string) {
    return this.commentService.findAllByPost(+id);
  }

  @Get('/my')
  @ApiOperation({
    summary: '내 댓글 조회',
    description: '자신이 작성한 모든 댓글을 조회합니다',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: CommentResponse })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  findAllByAuthor(@Session() session: any) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');
    const authorName = session.username;
    return this.commentService.findAllByAuthor(authorName);
  }

  @Patch('/:comment_id')
  @ApiOperation({ summary: '댓글 수정', description: '댓글을 수정합니다' })
  @ApiParam({ name: 'comment_id', description: '댓글 ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없음' })
  update(
    @Param('comment_id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Session() session: any,
  ) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');

    return this.commentService.update(+id, updateCommentDto, session.username);
  }

  @Delete('/:comment_id')
  @ApiOperation({ summary: '댓글 삭제', description: '댓글을 삭제합니다' })
  @ApiParam({ name: 'comment_id', description: '댓글 ID' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없음' })
  remove(
    @Param('comment_id') id: string,
    @Session() session: any,
  ) {
    if (!session || session.username === undefined)
      throw new UnauthorizedException('로그인하지 않으면 사용할 수 없습니다');
    return this.commentService.remove(+id, session.username);
  }
}
