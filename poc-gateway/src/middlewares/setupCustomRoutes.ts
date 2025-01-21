import type { RequestHandler } from 'http-proxy-middleware'
import { app } from '../server/app'
import { AppRouter } from '../server/router'
import { TRoutesConfig, TRouteConfig, TConfigProxy } from '../types/route.types'
import { addAuthHeaders, addOriginHeader, parseCookieOrJwt } from '../helpers/authHelper'
import { createProxy } from '../services/createProxy'

/**
 * Builds a config object to pass to the createProxyMiddleware method
 * Uses the passed in routeObj to know which options to include
 */
const buildProxyConfig = (routeObj: TRouteConfig) => {
  const { proxy, authHeader, originHeader, rewriteWithSession } = routeObj
  const { onProxyReq, onProxyRes, pathRewrite, ...proxyConfig } = proxy

  const config: TConfigProxy = {
    ...proxyConfig,
    onProxyReq: (proxyReq, req, res, options) => {
      authHeader && addAuthHeaders(proxyReq, req, res, app.locals.config)

      if (typeof onProxyReq === 'function') return onProxyReq(proxyReq, req, res, options)
    },
    onProxyRes: (proxyRes, req, res) => {
      originHeader && addOriginHeader(proxyRes, req, app.locals.config)

      if (typeof onProxyRes === 'function') return onProxyRes(proxyRes, req, res)
    },
  }

  typeof pathRewrite === 'function' &&
    (config.pathRewrite = async (path, req, res) => {
      const session = rewriteWithSession && (await parseCookieOrJwt(req, res))
      return pathRewrite(path, req, session) as string
    })

  return config
}

/**
 * Builds the config for a custom proxy based on passed in routObj
 * Allows creating a proxy to custom urls
 */
const setupCustomProxy = (routeObj: TRouteConfig): RequestHandler => {
  const { proxyFilter } = routeObj

  const proxyArgs = []
  typeof proxyFilter === 'function' && proxyArgs.push(proxyFilter)

  proxyArgs.push(buildProxyConfig(routeObj))

  /**
   * Typescript doesn't allow using a spread operator here, so we just reference them directly
   */
  return createProxy(proxyArgs[0], proxyArgs[1])
}

/**
 * Add the custom routes from the config to the app router
 */
export const setupCustomRoutes = () => {
  const customRoutes = app.locals.config.routes
  typeof customRoutes === 'object' &&
    Object.entries(customRoutes as TRoutesConfig).forEach(
      ([name, routeObj]: [string, TRouteConfig]) => {
        if (typeof routeObj !== 'object') return

        const { method, path, action, proxy } = routeObj

        typeof proxy === 'object'
          ? AppRouter[method](path, setupCustomProxy(routeObj))
          : AppRouter[method](path, action)
      }
    )
}
