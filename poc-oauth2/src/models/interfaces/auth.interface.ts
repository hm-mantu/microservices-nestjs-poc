
export class AuthUserI {
    username: string;
    email: string;
    fullname: string 
}
export class AuthUserTokenI {
    user: AuthUserI;
    token: string;
}