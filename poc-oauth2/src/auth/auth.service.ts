import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthUserTokenI, AuthUserI } from '../models/interfaces/auth.interface';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService:JwtService ) {}

    async getAuthenticatedUser(username: string, password: string): Promise<any> {
        try {
            const user = await this.userService.getUserByUsername(username);            
            await this.validatePassword(password, user.password); 
            return {   
                user: { 
                    email: user.email, 
                    fullname:`${user.firstname} ${user.middlename} ${user.lastname}`,
                    username: user.username 
                } as AuthUserI , 
                token: this.generateToken(user)
            } as AuthUserTokenI;           
        } catch (e) {
            console.log(e);
            throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
        }
    }

    async validatePassword(password: string, hashedPassword: string) {        
        const passwordMatched = await compareSync(
            password,
            hashedPassword,
        );
        if (!passwordMatched) {
            throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
        }
        return passwordMatched;
    }

    generateToken (data): string {
        try {
            const payload = { 
                username: data.username, 
                sub: {
                    name: `${data.firstname} ${data.middlename} ${data.lastname}`,
                    id: data.id,
                    emial: data.email,
                    failedAttempt: data.failedAttempt
                }, 
                issuer:'happiestminds.com',
                exp: new Date().setHours(24, 0, 0) 
            };
            return this.jwtService.sign(payload)
        } catch (error) {
            console.log(error);
        }
    }
}
