import { Controller, Post, Body, Get, Query, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwtauth.guard';
import { CreateClientDto } from './../models/dtos/client.dto';
import { ClientService } from './client.service';


@Controller('client')
export class ClientController {

    constructor(private readonly clientService: ClientService){}
    @UseGuards(JwtAuthGuard)
    @Post()
    async createClientCredentials(@Body() body, @Req() req): Promise<CreateClientDto>{
        try {
            const { name, secret, id } = body;
            const userId = req.user.user.id;
            const clientDetails  = await this.clientService.create({ id, name, secret, userId })
            return clientDetails;
        } catch (error) {
            console.log(error);
            
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get() 
    async getClientCredentials(@Query() query): Promise<CreateClientDto[]> {
        const { fields } = query;
        const clintDetails = await this.clientService.findAll({select: fields})
        return clintDetails; 
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:userid')
    async getClientDetailsByUserId(@Param() param): Promise<CreateClientDto[]> {
        const { userid } = param;
        const clintDetails = await this.clientService.findAll({ where:{ userId: userid }})
        return clintDetails; 
    }
}
