import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import { TokenModule } from './token/token.module';
import { OauthModule } from './oauth/oauth.module';
import { CodeModule } from './code/code.module';
import { SiteModule } from './site/site.module';
import * as winston from 'winston';

@Module({
  imports: [
    // Using config module for envs
    ConfigModule.forRoot(),

    // Using mongoose module
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'todoConnection',
      useFactory: async (configService: ConfigService) => {        
        return ({
          uri: `${configService.get('MONGO_URI')}/${configService.get('MONGO_DB')}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
      },
      inject: [ConfigService]
    }),

    // Using winston module for logger
    WinstonModule.forRoot({
      defaultMeta: { application: 'Oauth Application', module: 'app' },
      transports: [
          new winston.transports.Console({
            level: 'info', // error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
            format: winston.format.combine(
              winston.format.timestamp({
                format: () =>
                  new Date().toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    timeZoneName: 'short',
                  }),
              }),
              winston.format.colorize(),
              winston.format.prettyPrint(),
              winston.format.json(),
              winston.format.cli(),
            ),
          }),
          ...(process.env.NODE_ENV === 'development' ? 
            [
              new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: winston.format.combine(
                  winston.format.timestamp({
                    format: () =>
                      new Date().toLocaleString('en-US', {
                        timeZone: 'America/Los_Angeles',
                        timeZoneName: 'short',
                      }),
                  }),
                  winston.format.json(),
                ),
              }),
              new winston.transports.File({
                filename: 'logs/combined.log',
                level: 'debug',
                format: winston.format.combine(
                  winston.format.timestamp({
                    format: () =>
                      new Date().toLocaleString('en-US', {
                        timeZone: 'America/Los_Angeles',
                        timeZoneName: 'short',
                      }),
                  }),
                  winston.format.json(),
                ),
              }),
            ]
        : [])
      ]
    }),
    
    ClientModule,
    AuthModule,
    UserModule,
    TokenModule,
    OauthModule,
    CodeModule,
    SiteModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
