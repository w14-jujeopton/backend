// auth.controller.ts
import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { Serialize } from '../interceptor/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('로그인')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '구글 로그인',
    description: '구글 로그인 페이지로 리다이렉션됩니다, 로그인이 성공하면 클라이언트의' +
      '홈으로 리다이렉트 됩니다',
  })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  async googleLogin() {
    // 여긴 비워도 됨. Google 로그인 창으로 리디렉션됨.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: any,
    @Session() session: any,
    @Res() res: any,
  ) {
    let user = await this.authService.isAlreadySignedUp(req.user.email);
    if (user) {
      session.username = user.username;
    } else {
      user = await this.authService.socialSignUp(req.user.email, req.user.name);
      session.username = user.username;
    }

    return res.redirect(this.configService.get('REDIRECT_URI'));
  }
}
