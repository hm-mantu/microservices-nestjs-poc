export class ConfigService {
    private readonly envConfig: { [key: string]: any } = null;
    // server config 
    constructor() {
        this.envConfig = {};
        this.envConfig['serverConfig'] = {
            port: Number(process.env.PORT),
            host: process.env.HOST
        }
        this.envConfig['mongoConfig'] = {
            uri: process.env.MONGO_URI as string,
            dbname: process.env.MONGO_DB as string
        }
        this.envConfig['jwtConfig'] = {
            secret: process.env.JWT_SECRET as string
        }
    }

    get(key: string): any {        
        return this.envConfig[key];
    }
}