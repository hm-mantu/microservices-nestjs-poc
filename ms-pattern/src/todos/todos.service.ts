import { Injectable } from '@nestjs/common';
import { Todo, TodoDocument } from './../schemas/todos.schema'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoCreateDto } from '../dtos/todo.dto';

@Injectable()
export class TodosService {
    constructor(@InjectModel(Todo.name, 'todoConnection') private readonly todoModel: Model<TodoDocument>) {}

    async create(todo: TodoCreateDto): Promise<Todo> {
        const createdCat = new this.todoModel(todo);
        return createdCat.save();
    }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find().exec();
    }
}
