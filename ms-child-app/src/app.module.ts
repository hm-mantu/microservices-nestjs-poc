import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { ConfigService } from './services/child.config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    ConfigService,
    {
    provide: 'HELLO_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {    
      const helloServiceOptions = configService.get('helloService');    
      return ClientProxyFactory.create(helloServiceOptions)    
      // ClientProxyFactory.create({
      //   transport: Transport.TCP,
      //   options: {
      //     host: 'localhost',
      //     // configService.get("HELLO_SERVICE_HOST"),
      //     port: 9001
      //     // configService.get("HELLO_SERVICE_PORT")
      //   }
      // })
    }
  }],
})
export class AppModule {}
