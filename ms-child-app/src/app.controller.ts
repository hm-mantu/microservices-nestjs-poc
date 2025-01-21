import { Controller, Get, Inject, Body, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { Observable } from 'rxjs';
// import { AppService } from './app.service';

@Controller('hello')
export class AppController {
  constructor(@Inject('HELLO_SERVICE') private client: ClientProxy) {}

  @Get()
  getHello(){
    return this.client.send({ cmd: 'hello' }, "Mantu Pani");
  }


  @Get('health')
  getHealth() {
    console.log("Health API calling....")
    return `<html><head /><body><span>Child Is running!</span><script type='text/javascript'>console.log("access token from ambassador:"); console.log("Healthy")</script></body></html>`
  }

  @Post('todo')
  createTodo(@Body() body) {
    const {
      title,
      description
    } = body;
    console.log("Todo API calling....")
    return this.client.send({ cmd: 'create-todo' }, { title, description});
  }

  @Get('todo')
  getTodos() {
    // return this.client.send({ cmd: 'get-todos' }, {});
    return {hello: "How are you"}
  }

  @Get('queue')
  addQueMessage() {
    console.log(`Adding to queue called...`);
    return this.client.send({ cmd: 'queue-test' }, {});
  }

}
