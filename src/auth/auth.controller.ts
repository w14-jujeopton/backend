// auth.controller.ts
import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { Serialize } from '../interceptor/response.interceptor';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    ) {
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // 여긴 비워도 됨. Google 로그인 창으로 리디렉션됨.
  }

  @Get('google/callback')
  @Serialize(UserResponse)
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req : any, @Session() session: any, @Res() res: any) {
    console.log(`req.user = ${req.user}`)
    let user = await this.authService.isAlreadySignedUp(req.user.email)
    if (user)
    {
      session.username = user.username;
    }
    else
    {
      user = await this.authService.socialSignUp(req.user.email, req.user.name);
      session.username = user.username;
    }

    return res.redirect(this.configService.get('REDIRECT_URI'));
  }
}
