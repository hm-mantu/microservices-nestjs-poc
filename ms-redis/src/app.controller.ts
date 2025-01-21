import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller()
export class AppController {
  constructor(@InjectQueue('testing-queue') private testQ : Queue) {}

  @MessagePattern({ cmd: 'queue-test' })
  async getHello(): Promise<string> {
    try {      
      const job = await this.testQ.add('text', 'Hello world')
      console.log(`created job ${ job.id}`);
      // this.testQ.add('text', {data: "HEllo"}).then((data)=>{
      //   console.log(data);
      // }).catch((error)=>{
      //   console.log(error);
      // })
      return "Hello world Bull service is running..."
    } catch (error) {
      console.log(error);
      return "Error while adding in the queue.."
    }
    
  }
}
