import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({type: [String], default:'INPROGRESS'})
    todoPogress: string;

    @Prop({type: [Date], default:new Date()})
    createdAt: Date;
    

    @Prop({type: [Date], default:new Date()})
    updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

// export const CatSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     breed: String,
// });