import { Process, Processor } from "@nestjs/bull";
import { Job } from 'bull';

@Processor('testing-queue')
export class TestingProcessor{
    constructor(){}

    @Process('text')
    async handleText(job:Job) {
        console.log(job);
    }
}