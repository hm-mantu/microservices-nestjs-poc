import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './../schemas/todos.schema';

@Module({
    imports: [
        MongooseModule.forFeature([ { name: Todo.name,  schema: TodoSchema } ], 'todoConnection')
    ],
    controllers: [ TodosController ],
    providers: [ TodosService ]
})
export class TodosModule {}
