import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';
import { ApiModule } from '../api/api.module';

@Module({
  imports :[TypeOrmModule.forFeature([Post, User]), ApiModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
