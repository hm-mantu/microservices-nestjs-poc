import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly userModel: UserModel) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto)
  }

  findAll() {
    return this.userModel.findAllUsers({})
  }

  findOne(id: string) {
    return this.userModel.findByUserId(id)
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdateUser(id, updateUserDto)
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove(id)
  }
}
