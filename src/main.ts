import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    session({
      secret: "lee",
      resave: false, //모든 요청에 세션을 저장 안함
      saveUninitialized: false, //첫 요청을 보낸사용자를 null로 저장 안함
      cookie: {maxAge: 36000},
    })
  )
  app.use(passport.initialize()); //패스포트 초기화
  app.use(passport.session()); //세션에 저장소를 따로 설정 가능
  await app.listen(3000);
}
bootstrap();
