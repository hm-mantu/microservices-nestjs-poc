import path from 'path'
import { app } from '../server/app'
import { authRoutes } from '../constants'

let __AuthRoutes:any = null

export const routePaths = () => {
  const mainPath = '/auth'
//   app.locals.config.mainRoutesPath || '/wobo-auth'

  __AuthRoutes =
    __AuthRoutes ||
    authRoutes.reduce((acc, route) => {
      const key:string = route.replace(/\//, '').split(`-`).shift() as string
      acc[key] = path.join(mainPath, route)

      return acc
    }, {} as any)

  return __AuthRoutes
}
