import fs from 'fs'
import http from 'http'
import https from 'https'
import { app } from './app'

export type TSSLCreds = {
    ca?: string
    key?: string
    cert?: string
  }

/**
 * Loads the ssl certs file content from the defined paths
 */
const loadCredFiles = (certs: TSSLCreds) => {
  return Object.entries(certs).reduce((conf, [key, loc]: [string, string]) => {
    fs.existsSync(loc) && (conf[key] = fs.readFileSync(loc, 'utf8'))

    return conf
  }, {} as Record<string, string>)  
}

/**
 * Creates a secure server if a valid certs object is defined in the config, then returns it
 */
const setupHttpsServer = (logger: any) => {
  const { securePort = '443', certs } = app.locals.config
  const hasCerts = Boolean(certs?.cert && certs?.key)

  const credentials = hasCerts && loadCredFiles(certs)
  const httpsServer = credentials && https.createServer(credentials, app)

  const server =
    httpsServer &&
    httpsServer
      .listen(securePort, () => {
        logger.info(`Wobo-Auth Secure Server running on port ${securePort}`)
      })
      .on('error', (e) => {
        logger.error({
          error: e.stack,
          message: `Wobo-Auth FATAL Error: ${e.name} ${e.message} - Shutting down service...`,
        })
        // server.close()
      })

  return server
}

/**
 * Creates an insecure server and returns it
 */
const setupHttpServer = (logger: any) => {
  const { port } = app.locals.config
  const httpServer = http.createServer(app)

  const server = httpServer
    .listen(port, () => {
      logger.info(`Wobo-Auth Server running on port ${port}`)
    })
    .on('error', (e) => {
      logger.error({
        error: e.stack,
        message: `Wobo-Auth FATAL Error: ${e.name} ${e.message} - Shutting down service...`,
      })
      server.close()
    })

  return server
}

/**
 * Crease an express server based on the current app config
 */
export const initServer = () => {
  const { log } =  console;
//   initLogger() as Record<'logger', ILogger>
  const secureServer = setupHttpsServer(log)
  return secureServer || setupHttpServer(console)
}
