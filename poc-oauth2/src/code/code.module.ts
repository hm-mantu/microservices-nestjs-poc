import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from '../models/code.schema';
import { CodeService } from './code.service';

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Code.name,  schema: CodeSchema } ], 'todoConnection')
  ],
  providers: [CodeService]
})
export class CodeModule {}
