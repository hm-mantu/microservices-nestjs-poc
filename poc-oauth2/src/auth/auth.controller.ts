import { Controller, Post, UseGuards, Request, Get} from '@nestjs/common';
import { AuthUserTokenI } from '../models/interfaces/auth.interface';
import { JwtAuthGuard } from './guards/jwtauth.guard';
import { LocalAuthGuard } from './guards/localauth.guard';

@Controller('auth')
export class AuthController {
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async signin(@Request() request): Promise<AuthUserTokenI>{ 
        const user = request.user;    
        return user; 
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {        
        return req.user;
    }
}
