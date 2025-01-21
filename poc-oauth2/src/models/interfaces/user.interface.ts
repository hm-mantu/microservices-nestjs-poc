export interface UserI {
    username: string;
    password: string;
    oldpassword?: string; 
    firstname: string;
    lastname: string;
    middlename?: string;
    email: string;
    failedAttempt?: Number;
    createdAt?: Date;
    updatedAt?: Date;
}