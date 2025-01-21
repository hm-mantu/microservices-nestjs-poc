import {
    BEARER_PREFIX,
    JWT_CONSTANTS,
    LOCALS_JWT_PATH,
  } from '../constants'
  import { throwHttpException } from './authHelper'
  import { app } from '../server'
  import { mapRegisterUserResponse } from '../routes/login'
  import { set } from '@keg-hub/jsutils'
  import { Request, Response } from 'express'
  import Jwt from 'jsonwebtoken';
  import { validateAuthToken } from './authHelper'

  const callProxyUserAPI = (uid: any) => {
    return {people:{info:{}}}
  }
  
  /**
   * Checks if the request has been whitelisted for JWT authentication
   */
  export const allowedRequest = (req: Request): boolean => {
    const httpMethods = app?.locals?.config?.jwtConfig?.httpMethods
    const paths = app?.locals?.config?.jwtConfig?.paths
  
    if (!httpMethods && !paths) return true
  
    if (httpMethods && httpMethods.includes(req.method)) return true
  
    if (
      paths &&
      paths.some((routes:string) => {
        const regex = new RegExp(routes[1])
        return routes[0].includes(req.method) && regex.test(req.path)
      })
    )
      return true
  
    return false
  }
  
  /**
   * Checks if authorization header bearer token is a valid JWT
   */
  export const validateJwt = (req: Request): any => {
    validateAuthToken(req.headers['authorization'] as string)
  
    const bearerToken = req.headers['authorization']?.split(' ')[1] as string;
  
    try {
      return Jwt.verify(bearerToken, 'PUBLIC-KEY', {
        issuer: JWT_CONSTANTS.ISSUER,
        ignoreExpiration: true,
      }) as unknown
    } catch (e) {
      throwHttpException('S116', `JWT validation failed`)
    }
  }
  
  //This will likely change once we know more about what endpoints will be requested from server
  /**
   * Constructs user info object
   */
  export const constructUserInfo = async (userId: string): Promise<any> => {
    const userInfo = await callProxyUserAPI(userId)
  
    const userBody = {
      ...userInfo,
      maxAge: null,
      exp: null,
    }
  
    const registerData = app?.locals?.config?.registerUser
      ? {}
      : {}
  
    if (typeof registerData === 'object') {
      mapRegisterUserResponse(userBody, registerData)
    }
  
    return userBody
  }
  
  /**
   * Validates JWT and saves user info in res object to be later added as a proxy header
   */
  export const parseJwt = async (req: Request, res: Response): Promise<any> => {
    if (!allowedRequest(req))
      throwHttpException('S118', `Request not permitted for JWT authentication`)
  
    const decodedJwt = validateJwt(req)
  
    const userBody = await constructUserInfo(decodedJwt?.sub?.userId)
  
    set(res, LOCALS_JWT_PATH, JSON.stringify(userBody))
    return userBody
  }
  