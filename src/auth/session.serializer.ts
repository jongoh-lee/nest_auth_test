import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  //정보 저장할 때 사용
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user.email); //세션에 저장할 정보 > 해싱을 통해 저장
  }

  //정보 뺴올 때 사용
  async deserializeUser(
    payload: any,
    done: (err: Error, user: any) => void,
  ): Promise<any> {
    const user = await this.userService.getUser(payload);
    if (!user) {
      done(new Error('No user'), null);
      return;
    }

    const { password, ...userInfo } = user;
    password as string;
    done(null, userInfo);
  }
}
