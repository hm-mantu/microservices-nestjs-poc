import { Injectable } from '@nestjs/common';
import { Token, TokenDocument } from './../models/token.schema'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTokenDto, FilterTokenDto } from '../models/dtos/token.dto';

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name, 'todoConnection') private readonly tokenModel: Model<TokenDocument>) {}

    async create(userDetails: CreateTokenDto): Promise<Token> {
        const createdCat = new this.tokenModel(userDetails);
        return createdCat.save();
    }

    async validateByToken(token): Promise<Token> {
        return this.tokenModel.findOne({value: token}).exec();
    }

}

