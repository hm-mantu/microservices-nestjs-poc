import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Code, CodeDocument } from '../models/code.schema';
import { CreateCodeDto } from '../models/dtos/code.dto';

@Injectable()
export class CodeService {
    constructor(@InjectModel(Code.name, 'todoConnection') private readonly codeModel: Model<CodeDocument>) {}

    async create(userDetails: CreateCodeDto): Promise<Code> {
        const createdCat = new this.codeModel(userDetails);
        return createdCat.save();
    }

    async validateByToken(token): Promise<Code> {
        return this.codeModel.findOne({value: token}).exec();
    }

    async getByCode(code): Promise<Code> {
        return this.codeModel.findOne({value: code}).exec();
    }

    async removeCode(code): Promise<any> {
        return this.codeModel.findOneAndRemove({value: code});
    }
}
