import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [GoogleStrategy],
  exports: []
})
export class AuthModule {}
