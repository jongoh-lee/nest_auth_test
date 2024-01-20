import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(userDto: CreateUserDto) {
    const user = await this.userService.getUser(userDto.email);
    if (user) {
      throw new HttpException(
        '이미 존재하는 유저 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const encryptedPW = bcrypt.hashSync(userDto.password, 10);

    try {
      const user = await this.userService.createUser({
        ...userDto,
        password: encryptedPW,
      });
      user.password = undefined;
      return user;
    } catch (e) {
      throw new HttpException('서버에러', 500);
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUser(email);

    if (!user) {
      throw new HttpException('허용되지 않은 요청', HttpStatus.FORBIDDEN);
    }

    const { password: hashedPassword, ...userInfo } = user;

    if (bcrypt.compareSync(password, hashedPassword)) {
      return userInfo;
    } else {
      throw new HttpException('패스워드 불일치', HttpStatus.FORBIDDEN);
    }
  }
}
