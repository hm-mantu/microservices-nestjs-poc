import { app } from '../server'
import { parseCookieOrJwt } from '../helpers/authHelper'
import { Request, Response, NextFunction } from 'express'
import { AppRouter } from '../server'
import { routePaths } from './../helpers/routePaths'
import { bypassAuthRoutes } from '../constants'


/**
 * Helper to validate the route and check if it's in the bypassAuthRoutes array
 * Uses regex to allow sub-paths
 * Includes special handling for the root path
 */
const skipAuth = (originalUrl: string, noAuthRoutes: string[]): boolean => {
    return (
      originalUrl === `/` ||
      noAuthRoutes.some((route) => {
        const regex =  new RegExp(`^${route}`)
        // isGlob(route) ? globToRegExp(route) :
        return route !== `/` && originalUrl.match(regex)
      })
    )
  }

/**
 * Constructs an array of routes to bypass
 */
const skipAuthRoutes = () => {
    const { login } = routePaths()
    return [...(app?.locals?.config?.authBypass || []), ...bypassAuthRoutes, login]
}

/**
 * Authenticates user and adds them to the current session
 */
export const setupAuth = () => {
    AppRouter.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const skipRoutes = skipAuthRoutes()
        // if (!skipAuth(req.originalUrl, skipRoutes)) {
          res.locals.session = await parseCookieOrJwt(req, res)
        // }
        next()
      } catch (e) {
        return next(e)
      }
    })
  }