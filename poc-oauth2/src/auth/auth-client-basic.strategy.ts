import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ClientService } from '../client/client.service';

@Injectable()
export class AuthClientBasicStrategy extends PassportStrategy(BearerStrategy, 'client-basic') {
    constructor(
        private readonly clientService: ClientService
    ) {
        super({
            passReqToCallback: true,
            
        });
    }

    public validate = async ( username, password ): Promise<boolean> => {
       try {
            const clientDetails = await this.clientService.findByClientName(username);
            if (!clientDetails || clientDetails.secret != password) 
                throw new HttpException('Invalid Access', HttpStatus.UNAUTHORIZED);
            return true;
       } catch (error) {
            return false;
       }
    }
}