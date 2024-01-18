import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';
import { LoginGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService){}

	@Post('register')
	async register(@Body() userDto: CreateUserDto){
		return await this.authService.register(userDto);
	}

	@Post('login')
	async login(@Request() req, @Response() res){
		try {
			const userInfo = await this.authService.validateUser(
				req.body.email,
				req.body.password
			);
	
			if (userInfo){
				res.cookie('login', JSON.stringify(userInfo), {
					httpOnly: false,
					maxAge: 1000 * 60 * 60 * 24 * 7
				});
			}
			return res.send({message: 'login sucess'});
		}
		catch(e)
		{
			console.log(e)
			return res.send({message: 'login failed'});
		}
	}

	@UseGuards(LoginGuard)
	@Post('login2')
	async login2(@Request() req, @Response() res){
		if (!req.cookies['login'] && req.user){
			res.cookie('login', JSON.stringify(req.user), {
				httpOnly: false,
				maxAge: 1000 * 60 * 60 * 24 * 7
			});
		}
		return res.send({message: " login2 success"});
	}

	@UseGuards(LoginGuard)
	@Get('test-guard')
	testGuard(){
		console.log('hi')
		return 'login 성공 시에만 보입니다.'
	}
}
