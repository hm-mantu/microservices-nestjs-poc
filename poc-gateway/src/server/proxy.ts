import '../endpoints'
import { app } from './app'
import { initServer } from './server'
import { setupAuth } from '../middlewares/setupAuth'
import { setupProxy } from '../middlewares/setupProxy'
import { setupServer } from '../middlewares/setupServer'
import { setupEndpoints } from '../middlewares/setupEndpoints'
// import { setupCustomRoutes } from '../middlewares/setupCustomRoutes'
// import { setupErrorHandler } from '../middleware/setupErrorHandler'
// import { setupReqLogger, setupErrLogger } from '../middleware/setupLogger'

class WoboProxy {
  config: any

  /**
   * Method to initializes the proxy server config values
   */
  public init(setup: any) {
    // WoboProxyConfig.init(setup)

    return this
  }

  /**
   * Method to start the proxy server
   */
  public start() {
    if (!app.locals.config)
      throw new Error(
        `Proxy server not initialized. Must be called "WoboProxyInstance.init first"`
      )

    const { log } = console

    // setupReqLogger()
    setupServer()
    setupAuth()
    setupEndpoints()
    // setupCustomRoutes()
    setupProxy()
    // setupErrLogger()
    // setupErrorHandler()

    log({ message: 'Wobo-Auth Config', config: app.locals.config })

    initServer()
  }
}

const WoboProxyInstance = new WoboProxy()
export { WoboProxyInstance }
