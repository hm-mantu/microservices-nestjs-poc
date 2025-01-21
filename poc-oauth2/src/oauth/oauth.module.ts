import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OathServerService } from './oath-server/oath-server.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../models/user.schema';
import { TokenService } from '../token/token.service';
import { ClientService } from '../client/client.service';
import { CodeService } from '../code/code.service';
import { Code, CodeSchema } from '../models/code.schema';
import { Token, TokenSchema } from '../models/token.schema';
import { Client, ClientSchema } from '../models/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([ 
      { name: Code.name,  schema: CodeSchema } ,
      { name: Token.name,  schema: TokenSchema } ,
      { name: Client.name,  schema: ClientSchema }  
    ], 'todoConnection'),
  ],
  controllers: [OauthController],
  providers: [TokenService, ClientService, CodeService, OathServerService]
})
export class OauthModule {}
