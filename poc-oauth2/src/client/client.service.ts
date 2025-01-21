import { Injectable } from '@nestjs/common';
import { Client, ClientDocument } from './../models/client.schema'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientDto, FilterClientDto } from '../models/dtos/client.dto';

@Injectable()
export class ClientService {
    constructor(@InjectModel(Client.name, 'todoConnection') private readonly clientModel: Model<ClientDocument>) {}

    async create(clientDetails: CreateClientDto): Promise<Client> {
        const createdCat = new this.clientModel(clientDetails);
        return createdCat.save();
    }

    async findAll({where, select}: FilterClientDto): Promise<Client[]> {
        return this.clientModel.find()
            .where(where)
            .select(select)
            .exec();
    }

    async findByClientName(name): Promise<Client> {
        return this.clientModel.findOne({ name }).exec();
    }

    async findByClientid(id): Promise<Client> {
        return this.clientModel.findById(id).exec();
    }
}
