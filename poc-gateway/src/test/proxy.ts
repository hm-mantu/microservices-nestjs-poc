import { app } from './app'
import { initServer } from './server'
// import { setupAuth } from '../middleware/setupAuth'
import { setupProxy } from './setupProxy'
import { setupServer } from './setupServer'
import dotenv from 'dotenv';
// import { setupEndpoints } from '../middleware/setupEndpoints'
// import { setupCustomRoutes } from '../middleware/setupCustomRoutes'
// import { setupErrorHandler } from '../middleware/setupErrorHandler'
// import { setupReqLogger, setupErrLogger } from '../middleware/setupLogger'
dotenv.config();

class HMProxy {
    config: any;

    public init(setup: any) {
        // WoboProxyConfig.init(setup)
        app.locals.config = {
            port: process.env.PORT,
            allowOrigin: 'http://localhost:4005'
        }
        return this
    }

    public start() {
        if (!app.locals.config) throw new Error(`Proxy server not initialized. Must be called "WoboProxyInstance.init first"`);        
        setupServer();
        setupProxy();
        initServer()
    }
}


const HmProxyInstance = new HMProxy()
export { HmProxyInstance }