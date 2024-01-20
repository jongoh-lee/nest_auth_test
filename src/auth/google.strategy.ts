import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserService } from './../user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
//인증시 사용하는 클래스
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_PW,
      callbackURL: 'http://localhost:3000/auth/google',
      scope: ['email', 'profile'],
    });
  }
  async validate(acessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;
    console.log(acessToken);
    console.log(refreshToken);

    const providerId = id;
    const email = emails[0].value;

    const user: User = await this.userService.findByEmailOrSave(
      email,
      name.familyName + name.givenName,
      providerId,
    );

    return user;
  }
}
