import { RequestHandler, Options } from 'http-proxy-middleware'

import { Request, Response, NextFunction } from 'express'

export type TRequest = Request
export type TResponse = Response

export type LogObj = {
  [key: string]: string | number | boolean | Record<string, any>
}

export type TRoutePaths = {
  login?: string
  users?: string
  logout?: string
  health?: string
  session?: string
}

export type ISessionData = {
  exp: number
  maxAge: number
} & ISessionUser

export type ISessionUser = {
  id: string
  orgId: string
  firstName: string
  lastName: string
  email: string
  picture: string
  company: string
  title: string
  managerId: string | undefined
  customClaims?: { externalUserId?: string } & Record<string, any>
}

export type TRouteMethod = (req?: Request, res?: Response, next?: NextFunction) => void

type TPathRewriteMethod = (
  path?: string,
  req?: Request,
  session?: any
) => Promise<string> | string
type TPathRewriteObject = Record<string, string>

export type TConfigProxy = Omit<Options, 'pathRewrite'> & {
  pathRewrite?: TPathRewriteMethod | TPathRewriteObject
}

export type TRequestHandler = RequestHandler

export type TRouteConfig = {
  method: string
  path: string
  proxy?: TConfigProxy
  authBypass?: boolean
  authHeader?: boolean
  action?: TRouteMethod
  originHeader?: boolean
  rewriteWithSession?: boolean
  proxyFilter?: (pathname: string, req: Request) => boolean
}

export type TRoutesAuthBypass = string[]

export type TRoutesConfig = {
  [key: string]: TRouteConfig
}

export type TRoutesOptions = {
  routes?: TRoutesConfig
  authBypass?: TRoutesAuthBypass
}
