import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './../models/user.schema'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, FilterUserDto } from '../models/dtos/user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name, 'todoConnection') private readonly userModel: Model<UserDocument>) {}

    async create(userDetails: CreateUserDto): Promise<User> {
        const createdCat = new this.userModel(userDetails);
        return createdCat.save();
    }

    async findAll({ where, select }: FilterUserDto): Promise<User[]> {
        try {
            return await this.userModel.find()
                .where(where)
                // .select(select)
                .exec();
        } catch (error) {
            console.log(error);
            
        }
    }

    async findUserById(id, {select}: FilterUserDto): Promise<User> {
        return this.userModel.findById(id)
            .select(select)
            .exec();
    }

    async updateUserById(id, body): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, body);
    }

    async updateUser(where, body): Promise<any> {
        return this.userModel.updateMany(where, body);
    }

    async deleteUserById(id): Promise<any> {
        return this.userModel.findByIdAndDelete(id);
    }

    async getUserByUsername(username): Promise<any> {
        return this.userModel.findOne({username});
    }

}
