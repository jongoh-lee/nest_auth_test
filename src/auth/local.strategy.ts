import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  //클래스 믹스인 기능으로 상위 클래스 필드의 변수명을 바꾸고 기능을 추가하는 방법
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = this.authService.validateUser(email, password);
    if (!user) {
      return null;
    }
    return user;
  }
}
