import { Request, Response } from 'express'
import { ClientRequest, IncomingMessage } from 'http'
import { cookies } from '../constants'
import { decryptSignedCookie, parseSessionFromCookie } from './cookieHelper'
import { get } from '@keg-hub/jsutils';
import { LOCALS_JWT_PATH } from '../constants';
import { parseJwt } from './jwtHelper';

/**
 * Helper to throw when there is an auth error
 */
export const throwHttpException = (
  errorCode: string,
  message: string,
  logObj?: any,
  exception?: string,
  status?: number
): void => {
  const ticketId = ''
  console.error({
    ...logObj,
    message,
    ticketId,
    errorCode,
  })

  throw new Error(exception || 'Unauthorized')
}

/**
 * Validates the passed in authToken to ensure it exists, and is type bearer
 * @throws
 */
export const validateAuthToken = (authToken: string): void => {
  !authToken && throwHttpException('S100', `Missing auth token`)

  !authToken.toString().toLocaleLowerCase().startsWith('bearer ') &&
    throwHttpException('S101', `Auth token missing valid type "bearer"`)
}

/**
 * Tries to parse JWT. If it fails, tries to parse Wobo-Auth cookie
 */
export const parseCookieOrJwt = async (
  req: Request,
  res: Response
): Promise<any> => {
  let error: any
  const hasAuthHeader = Boolean(req.headers['authorization'])
  const hasCookie = Boolean(req.signedCookies[cookies.auth])

  if (hasAuthHeader) {
    try {
      console.info('Checking for valid JWT')
      return await parseJwt(req, res)
    } catch (jwtError) {
      error = jwtError
    }
  }

  if (hasCookie) {
    try {
      console.info('Checking for valid Wobo-Auth cookie')
      return parseSessionFromCookie(req)
    } catch (cookieError) {
      error = cookieError
    }
  }

  throwHttpException('S117', 'Failed JWT or Wobo-Auth cookie authentication', {
    message: error?.message,
    stack: error?.stack,
  })
}

/**
 * Updates the headers of the request sent to the proxy url
 */
export const addAuthHeaders = (
  proxyReq: ClientRequest,
  req: Request,
  res: Response,
  config: any
): void => {
  const { proxySecret, proxySecretHeader, encodeHeader, jwtConfig } = config

  proxySecretHeader && proxyReq.removeHeader(proxySecretHeader)
  proxySecretHeader && proxySecret && proxyReq.setHeader(proxySecretHeader, proxySecret)

  const jwtUserInfo = get(res, LOCALS_JWT_PATH)
  if (jwtUserInfo) {
    proxyReq.setHeader('x-signed-cookie', jwtUserInfo)
    jwtConfig?.header && proxyReq.setHeader(jwtConfig.header, 'true')
    return
  }
  const cookie = decryptSignedCookie(req)
  if (cookie) {
    const signedCookieVal = encodeHeader ? encodeURI(cookie) : cookie
    proxyReq.setHeader('x-signed-cookie', signedCookieVal)
  }
}

/**
 * Updates the headers of the response to include the Access-Control-Allow-Origin header
 */
export const addOriginHeader = (
  proxyRes: IncomingMessage,
  req: Request,
  config: any
) => {
  const origin = (req.get('origin') || '').trim()
  config.allowOrigin.includes(origin) &&
    (proxyRes.headers['Access-Control-Allow-Origin'] = origin)
}
