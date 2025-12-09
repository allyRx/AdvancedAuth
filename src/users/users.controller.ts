import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/decorators/auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ){}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(){
        this.userService.findAll()
    }

}
