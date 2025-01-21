import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
// import * as passport from 'passport';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super();
    }

    public validate = async (username, password): Promise<any> => {
        try {
            const user = await this.authService.getAuthenticatedUser(username, password);
            if (!user) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (error) {
            console.log(error);
            
        }
    }
}