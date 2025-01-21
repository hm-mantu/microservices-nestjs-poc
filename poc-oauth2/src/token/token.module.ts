import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '../models/token.schema';
import { TokenService } from './token.service';

@Module({
    imports: [
        MongooseModule.forFeature([ { name: Token.name,  schema: TokenSchema } ], 'todoConnection')
    ],
    controllers: [],
    providers: [TokenService]
})
export class TokenModule {}
