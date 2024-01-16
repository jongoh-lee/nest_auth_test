import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	)
	{}

	createUser(user: User): Promise<User>{
		return this.userRepository.save(user);
	}

	async getUser(email : string){
		const result = await this.userRepository.findOne({
			where: {
				email
			}
		})
		return result
	}

	async updateUser(email: string, _user: User){
		const user = await this.getUser(email);
		console.log(_user);
		user.username = _user.username;
		user.password = _user.password;
		console.log(user);
		this.userRepository.save(user);
	}

	deleteUser(email:string){
		this.userRepository.delete({email})
	}
}
