import { Module } from '@nestjs/common';
import { ApiAdvice } from './api.advice';

@Module({
  imports: [],
  controllers: [],
  providers: [ApiAdvice],
  exports: [ApiAdvice]
})
export class ApiModule {}
