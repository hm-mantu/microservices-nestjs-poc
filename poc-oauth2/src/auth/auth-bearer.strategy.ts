import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
// import * as passport from 'passport';

@Injectable()
export class AuthBearerStrategy extends PassportStrategy(BearerStrategy) {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService
    ) {
        super({
            passReqToCallback: true,
            
        });
    }

    public validate = async ( accessToken ): Promise<boolean> => {
        const tokenDetails = await this.tokenService.validateByToken(accessToken);
        if (!tokenDetails) throw new HttpException('Invalid Access', HttpStatus.UNAUTHORIZED);
        const userDetails = await this.userService.findUserById(tokenDetails.userId, {});
        if (!userDetails) throw new HttpException('Invalid Access', HttpStatus.UNAUTHORIZED);
        return true;
    }
}