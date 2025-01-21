import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

class Address {
    address1: string
    address2: string
    zipcode: string
    state: string
    city: string
}

@Schema({ collection: 'users'})
export class User  {
  @Prop({type: String, required: true, unique: true})
  username: string

  @Prop({type: String, required: true})
  password: string

  @Prop({type:String, required: true, unique: true})
  email: string

  @Prop({type: Address})
  address: Address

  @Prop({default: 2}) // 2 - inprogress, 1 - success
  status: number
}

export const UserSchema =
  SchemaFactory.createForClass(User);
