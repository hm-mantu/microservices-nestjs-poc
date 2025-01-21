import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type UiSchemaConfigDocument = HydratedDocument<UiSchemaConfig>;

@Schema()
export class UiSchemaConfig {
    @Prop({type:String, required:true, unique:true})
    componentType: string;

    @Prop({type:String, default:{}})
    componentSchema: string;

    @Prop({type:String, default:{}})
    componentUiSchema: string;

    @Prop({type: Boolean, default:false})
    componentStatus: Boolean // active:true, inactive:false

    @Prop({type: mongoose.Schema.Types.ObjectId, default: null})
    createdBy: mongoose.Schema.Types.ObjectId

    @Prop({type: mongoose.Schema.Types.ObjectId, default: null})
    updatedBy: mongoose.Schema.Types.ObjectId

    @Prop({type: Date, default:new Date()})
    createdAt: Date;

    @Prop({type: Date, default:new Date()})
    updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(UiSchemaConfig);