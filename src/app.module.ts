import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'test_auth_test.sqlite', //db 파일 명
      entities: [User],
      synchronize: true, // DB 스키마 동기화, 개발 환경에서만 사용
      logging: true,
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot(), //.env읽어오도록
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
