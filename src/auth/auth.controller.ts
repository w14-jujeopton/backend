// auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // 여긴 비워도 됨. Google 로그인 창으로 리디렉션됨.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req) {
    // 구글이 넘겨준 유저 정보는 req.user에 있음
    return req.user;
  }
}
