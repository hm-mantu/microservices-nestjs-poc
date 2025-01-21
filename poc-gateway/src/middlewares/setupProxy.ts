import type { RequestHandler } from 'http-proxy-middleware'
import { URL } from 'url'
import { Request, Response } from 'express'
import { app } from '../server/app'
import { AppRouter } from '../server/router'
import { ClientRequest, IncomingMessage } from 'http'
import { createProxy } from '../services/createProxy';
import { addAuthHeaders, addOriginHeader } from '../helpers/authHelper'


/**
 * Method that creates the proxy using createProxyMiddleware
 */
const buildProxy = (config: any): RequestHandler => {
    return createProxy({
      target: new URL(config.apiBaseUrl).toString(),
      onProxyReq: (proxyReq: ClientRequest, req: Request, res: Response) =>
        addAuthHeaders(proxyReq, req, res, config),
      onProxyRes: (proxyRes: IncomingMessage, req: Request) =>
        addOriginHeader(proxyRes, req, config),
    })
  }
  
  /**
   * Proxy middleware to forward requests to the API-Service
   */
  export const setupProxy = () => {
    AppRouter.all('*', buildProxy(app.locals.config))
  }
  