import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Todo } from '../schemas/todos.schema';
import { TodosService } from './todos.service';


@Controller()
export class TodosController {
    constructor(private readonly todoService: TodosService) {}

    @MessagePattern({ cmd: 'create-todo' })
    create(input?: any): Promise<Todo> {    
        return this.todoService.create(input)
    }

    @MessagePattern({ cmd: 'get-todos' })
    getAll(input?: any): Promise<Todo[]> {    
        return this.todoService.findAll()
    }
}
