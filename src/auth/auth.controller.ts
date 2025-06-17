// auth.controller.ts
import { Controller, Get, Req, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { Serialize } from '../interceptor/response.interceptor';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // 여긴 비워도 됨. Google 로그인 창으로 리디렉션됨.
  }

  @Get('google/callback')
  @Serialize(UserResponse)
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Session() session: any) {
    console.log(`req.user = ${req.user}`)
    let user = await this.authService.isAlreadySignedIn(req.user.email)
    if (user)
    {
      session.username = user.username;
    }
    else
    {
      user = await this.authService.socialSignUp(req.user.email, req.user.name);
      session.username = user.username;
    }

    return req.user;
  }
}
