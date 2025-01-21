import { root } from './root'
import { me } from './me'
import { login } from './login'
import { logout } from './logout'
// import { extend } from './extend'
import { health } from './health'
// import { session } from './session'
import { AppRouter } from '../server/router'
import { routePaths } from '../helpers/routePaths'

export const initEndpoints = () => {
  const routes = routePaths()

  AppRouter.get('/', root)
  AppRouter.post(routes.login, login)
  AppRouter.get(routes.logout, logout)
//   AppRouter.get(routes.session, session)
//   AppRouter.put(routes.session, extend)
  AppRouter.get(routes.users, me)
  AppRouter.get(routes.health, health)
}
