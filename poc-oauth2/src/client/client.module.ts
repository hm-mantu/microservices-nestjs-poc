import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client, ClientSchema } from './../models/client.schema'

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Client.name,  schema: ClientSchema } ], 'todoConnection')
  ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}
