import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { Serialize } from '../interceptor/response.interceptor';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @Serialize(UserResponse)
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto.username, dto.password);
  }

  @Post('/signup')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto.username, dto.password, dto.nickname);
  }

  @Get()
  @Serialize(UserResponse)
  findAll() {
    return this.userService.findAll();
  }

  @Serialize(UserResponse)
  @Get('/:username')
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Patch('/:username')
  update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(username, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
