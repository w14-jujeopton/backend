import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('주접톤')
    .setDescription('주접톤 API')
    .setVersion('1.0')
    .addTag('jujeopton')
    .build();

  app.use(
    cookieSession({
      name: 'session',
      keys: ['wearejunglerocks'],
      expires: 24 * 60 * 60 * 1000,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  )
  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:5173'], // 프론트 도메인
    credentials: true,
  });


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
