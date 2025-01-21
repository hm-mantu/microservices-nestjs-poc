import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
    @Prop({required: true, type: String})
    clientId: string;

    @Prop({ required: true, type: String})
    value: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({type: [Date], default:new Date()})
    createdAt: Date;

    @Prop({type: [Date], default:new Date()})
    updatedAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
