import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: 'username123', description: '아이디' })
  username: string;
  @IsString()
  @ApiProperty({ example: 'password123', description: '패스워드' })
  password: string;
}