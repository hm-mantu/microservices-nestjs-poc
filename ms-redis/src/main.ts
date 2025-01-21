import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = Number(process.env.NODE_PORT) || 9003;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport:Transport.TCP,
    options: {
      host: 'localhost',
      port: port,
      retryAttempts: 3,
      retryDelay: 300
    }
  });

  await app.listen();
  Logger.log(`Redis(service) started on the port - ${port}.`)
  
}
bootstrap();
