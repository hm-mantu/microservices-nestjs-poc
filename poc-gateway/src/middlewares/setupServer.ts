import cors from 'cors'
import { app } from '../server/app'
import cookieParser from 'cookie-parser'
import { AppRouter } from '../server/router'

/**
 * Configures the express bodyParser and add the AppRouter to the express app
 * @param {Object} app - Express app object
 *
 */
export const setupServer = () => {
  app.disable('x-powered-by')

  app.use(
    cors({
      credentials: true,
      origin: app.locals.config.allowOrigin,
    })
  )

  app.use(cookieParser(app.locals.config.sharedSecret))

  // Add the AppRoute that contains all the configured endpoints
  app.use(AppRouter)
}
