import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type CodeDocument = HydratedDocument<Code>;

@Schema()
export class Code {
    @Prop({required: true, type: String})
    clientId: string;

    @Prop({ required: true, type: String})
    value: string;

    @Prop({ type: String, required: true })
    redirectUri: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({type: [Date], default:new Date()})
    createdAt: Date;

    @Prop({type: [Date], default:new Date()})
    updatedAt: Date;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
