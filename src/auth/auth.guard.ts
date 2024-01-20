import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.cookies['login']) {
      return true;
    }

    if (!request.body.email || !request.body.password) {
      return false;
    }

    const user = await this.authService.validateUser(
      request.body.email,
      request.body.password,
    );

    if (!user) {
      return false;
    }
    request.user = user;
    return true;
  }
}

@Injectable()
//emain, pw를 사용해서 로그인 하는 경우 local을 사용한다.
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: any): Promise<boolean> {
    try {
      const result = (await super.canActivate(context)) as boolean;
      //로컬 스트래티지를 실행할 예정 auth.strategy.ts 실행
      const request = context.switchToHttp().getRequest();
      await super.logIn(request); //세션 저장, serializeUser함수 사용
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}

@Injectable()
//세션에 데이터를 저장하고 돌려줌, cid라는 이름의 쿠키를 만들어서 인증 여부 확인
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: any): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request); // 세션에 유저 정보 저장
    return result;
  }
}
