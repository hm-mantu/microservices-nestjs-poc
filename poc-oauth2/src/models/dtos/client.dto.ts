export class CreateClientDto {
    id?:string;
    name: string;
    secret: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class FilterClientDto {
    where?: any;
    select?: any;
}