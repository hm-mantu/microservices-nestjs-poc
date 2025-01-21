import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './auth-basic.strategy';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './../models/user.schema';
import { UserService } from '../user/user.service';
import { AuthBearerStrategy } from './auth-bearer.strategy';
import { TokenService } from '../token/token.service';
import { Token, TokenSchema } from '../models/token.schema';
import { AuthClientBasicStrategy } from './auth-client-basic.strategy';
import { ClientService } from '../client/client.service';
import { Client, ClientSchema } from '../models/client.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([ 
      { name: User.name,  schema: UserSchema } ,
      { name: Token.name,  schema: TokenSchema } ,
      { name: Client.name,  schema: ClientSchema }  
    ], 'todoConnection'),
    PassportModule, 
    ConfigModule,
    JwtModule.register({
      secret: jwtConstants.secret
    }),
  ],
  controllers: [ AuthController ],
  providers: [ BasicStrategy, JwtStrategy, /* AuthBearerStrategy, AuthClientBasicStrategy,*/ AuthService, UserService, TokenService, ClientService ],
})
export class AuthModule {}
