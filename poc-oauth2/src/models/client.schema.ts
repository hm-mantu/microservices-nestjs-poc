import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
    @Prop({required: true, type: String})
    id: string;

    @Prop({unique: true, required: true, type: String})
    name: string;

    @Prop({ type: String, required: true })
    secret: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({type: [Date], default:new Date()})
    createdAt: Date;

    @Prop({type: [Date], default:new Date()})
    updatedAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
