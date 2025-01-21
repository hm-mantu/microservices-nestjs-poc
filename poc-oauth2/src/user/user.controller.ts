import { Controller, Post, Get, Put, Delete, Body, Query, Param, Inject, UseGuards, Request} from '@nestjs/common';
import { UserService } from './user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtAuthGuard } from '../auth/guards/jwtauth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger){
    }
    
    @UseGuards(JwtAuthGuard)
    @Post()
    createUser(@Body() body): Promise<any> {
        return this.userService.create(body)
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    updateUser(@Body() body): Promise<any> {
        const { where, data } = body;
        return this.userService.updateUser( where, data)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUser(@Query() query, @Request() req): Promise<any>{
        const {where, select} = query; 
        return this.userService.findAll({ where, select});
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    getUserById(@Param() param): Promise<any>{
        const {id} = param; 
        return this.userService.findUserById(id, {});
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    updateUserById(@Param() param, @Body() body): Promise<any>{
        const {id} = param; 
        const { data } = body; 
        return this.userService.updateUserById(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    deleteUserById(@Param() param): Promise<any>{
        const {id} = param; 
        return this.userService.deleteUserById(id);
    }
}
