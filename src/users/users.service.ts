import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}


    //finc user by Email
    async findUserByEMail(email: string){
        return await this.userRepository.findOne({where: {email}})
    }


    //create user 
    async createUser(user: Partial<User>): Promise<User>{
        
        const newuser = this.userRepository.create(user);
        return this.userRepository.save(newuser);
    }


}
