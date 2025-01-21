import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { genSaltSync, hashSync, compareSync  } from 'bcrypt';


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({required: true, type: String, unique: true})
    username: string;

    @Prop({ required: true, type: String})
    password: string;

    @Prop({ type: String, required: true})
    oldpassword: string;

    @Prop({ type: String, required: true, unique:true })
    email: string;

    @Prop({ type: Number, required: true, default:0 })
    failedAttempt: number;

    @Prop({ type: String })
    firstname: string;

    @Prop({ type: String })
    lastname: string;

    @Prop({ type: String, default: "" })
    middlename: string;

    @Prop({type: [Date], default:new Date()})
    createdAt: Date;

    @Prop({type: [Date], default:new Date()})
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (callback){
    try {
        const user = this;
        // Break out if the password hasn't changed
        if (!user.isModified('password')) return callback();
        const saltValue = genSaltSync(5)
        const hash = hashSync(user.password, saltValue)
        user.password = hash;
        return callback();
    } catch (error) {
        return callback(error)
    }
})

UserSchema.methods.verifyPassword = async function (password){
    const isValid = compareSync(password, this.password)
    return isValid;
}
