export class CreateUserDto {
    username: string;
    password: string;
    oldpassword?: string; 
    firstname: string;
    lastname: string;
    middlename?: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class FilterUserDto {
    where?: any;
    select?: any;
}