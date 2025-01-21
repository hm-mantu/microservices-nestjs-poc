import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 9000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  log(`Application(microservice)-Child started on ${port} port`)
}
bootstrap();
