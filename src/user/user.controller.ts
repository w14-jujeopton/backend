import { Controller, Get, Post, Body, Patch, Param, Delete, Session, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { Serialize } from '../interceptor/response.interceptor';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('회원')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @Serialize(UserResponse)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: UserResponse })
  @ApiResponse({ status: 404, description: '존재하지 않는 유저' })
  @ApiResponse({ status: 401, description: '잘못된 패스워드' })
  async login(@Body() dto: LoginDto, @Session() session: any) {
    const user = await this.userService.login(dto.username, dto.password);
    session.username = user.username;
    return user;
  }

  @Post('/logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async logout(@Session() session: any) {
    session.username = null;
    return { message: '로그아웃 되었습니다' };
  }

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: UserResponse,
  })
  async create(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.userService.create(
      dto.username,
      dto.password,
      dto.nickname,
    );
    session.username = user.username;
    return user;
  }

  @Get()
  @Serialize(UserResponse)
  @ApiOperation({ summary: '모든 유저 조회' })
  @ApiResponse({ status: 200, description: '조회 성공', type: [UserResponse] })
  findAll() {
    return this.userService.findAll();
  }

  @Serialize(UserResponse)
  @Get('/:username')
  @ApiOperation({ summary: '특정 유저 조회' })
  @ApiResponse({ status: 200, description: '조회 성공', type: UserResponse })
  @ApiResponse({ status: 404, description: '존재하지 않는 유저' })
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Patch('/:username')
  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiResponse({ status: 200, description: '수정 성공', type: UserResponse })
  @ApiResponse({ status: 404, description: '존재하지 않는 유저' })
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @Session() session: any,
  ) {
    if (!session || session.username !== username) {
      throw new UnauthorizedException('검증받은 유저가 아닙니다');
    }
    return this.userService.update(username, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
