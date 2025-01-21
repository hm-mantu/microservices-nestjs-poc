import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = process.env.API_GATEWAY_PORT;
    this.envConfig.helloService = {
        options: {
            port: process.env.HELLO_SERVICE_PORT,
            host: process.env.HELLO_SERVICE_HOST
        },
        transport: Transport.TCP,
    }
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}