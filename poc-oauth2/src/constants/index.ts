import { ConfigService } from './../configs/config'; 
const cfg = new ConfigService();
const jwtConfig = cfg.get('serverConfig')
export const jwtConstants = {
    secret : jwtConfig.secret || 'MY-SECRET-A2Z1210'
}