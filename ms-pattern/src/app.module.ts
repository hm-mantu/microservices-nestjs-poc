import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { cfgEnv } from './configs'
import { TodosModule } from './todos/todos.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    // Multiple connections for DB todoConnection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'todoConnection',
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get('MONGO_URI')}/${configService.get('MONGO_DB')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService]
    }),

    // Multiple connections for DB newApplicationConnection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'newApplicationConnection',
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get('MONGO_URI')}/${configService.get('MONGO_DB')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),

    TodosModule,

    UserModule,
    

  ],
  controllers: [AppController],
  providers: [AppService, cfgEnv, ConfigService]
})
export class AppModule {}
