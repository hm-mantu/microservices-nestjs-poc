import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import { log } from 'console';
import { cfgEnv } from './configs'

async function bootstrap() {
  const confiService = new cfgEnv();
  const port = confiService.get('serverConfig').port || 9005;
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
  log(`Application(microservice)-Parent started on ${port} port`)
}
bootstrap();
