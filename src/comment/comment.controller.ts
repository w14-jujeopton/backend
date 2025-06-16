import { Controller, Get, Post, Body, Patch, Param, Delete, Session } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('comment')
@ApiTags('댓글')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:id')
  create(
    @Param('id') id: number,
    @Session() session: any,
    @Body() dto: CreateCommentDto,
    ) {
    const authorName = session.username;
    return this.commentService.create(authorName, id, dto.content);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('/:id')
  findAllByPost(@Param('id') id: string) {
    return this.commentService.findAllByPost(+id);
  }

  @Get('/my')
  findAllByAuthor(@Session() session: any) {
    const authorName = session.username;
    return this.commentService.findAllByAuthor(authorName);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
