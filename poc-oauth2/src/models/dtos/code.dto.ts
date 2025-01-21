export class CreateCodeDto {
    id?:string;
    value: string;
    clientId: string;
    userId: string;
    redirectUri: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class FilterCodeDto {
    where?: any;
    select?: any;
}