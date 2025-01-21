import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserModel } from './models/user.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: User.name, 
        schema: UserSchema
      }
    ], 'todoConnection'),
    MongooseModule.forFeature([
      {
        name: User.name, 
        schema: UserSchema
      }
    ], 'newApplicationConnection')
  ],
  controllers: [UserController],
  providers: [UserService, UserModel]
})
export class UserModule {}
