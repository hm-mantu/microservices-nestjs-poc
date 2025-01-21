import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';
import { TestingProcessor } from './app.processor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }
    }),
    BullModule.registerQueue({
      name: "testing-queue"
    }),
    TodoModule
  ],
  controllers: [AppController],
  providers: [AppService, TestingProcessor],
})
export class AppModule {}
