import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';

@Module({
  //마찬가지 세션을 사용하려면 추가해 줘야함
  imports: [UserModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  //명시적으로 아래 코드를 사용하지는 않지만 내부적으로 클래스를 참조해서 추가해줘야 함
  providers: [AuthService, LocalStrategy, SessionSerializer, GoogleStrategy],
})
export class AuthModule {}
