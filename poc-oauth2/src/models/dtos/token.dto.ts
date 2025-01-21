export class CreateTokenDto {
    id?:string;
    value: string;
    clientId: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class FilterTokenDto {
    where?: any;
    select?: any;
}