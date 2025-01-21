import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserModel {
    constructor(@InjectModel(User.name, 'todoConnection') private readonly userModel: Model<User> ) {}

    create = (body) => this.userModel.create(body)
    findByUserId = (userId) => this.userModel.findById(userId) 
    findAllUsers = (where, fields='', limit='', skip='', sort:any = {createdAt: -1}) => {
        const opts = {
            sort
        }

        if (limit) opts['limit'] = Number(limit)
        if (skip) opts['skip'] = Number(skip)

        return this.userModel.find(where, fields, opts)
    }

    findAllUsersByFunction = (where, fields, limit, skip, sort) => this.userModel.find().where(where).select(fields).skip(skip).limit(limit).sort(sort)

    updateUser = (where, body) => this.userModel.updateOne(where, {$set: body})
    
    updateAllUser = (where, body) => this.userModel.updateMany(where, {$set: body})

    findByIdAndUpdateUser = (id, body) => this.userModel.findByIdAndUpdate(id, {$set: body}, {new: true})

    findOneAndUpdateUser = (where, body) => this.userModel.findOneAndUpdate(where, {$set: body}, {new: true})

    findByIdAndRemove = (id) => this.userModel.findByIdAndRemove(id)

}