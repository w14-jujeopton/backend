import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  /**
   * 유저를 업데이트 하기 위한 정보입니다.
   * nickname은 문자열이어야 하고, 비어있을 수 없습니다
   */
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'newNickname123', description: '수정할 닉네임' })
  nickname: string;
}
