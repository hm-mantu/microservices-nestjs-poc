import { cookies } from '../constants'
import { throwHttpException } from './authHelper'
import { Request } from 'express'
import { crypto } from '../services'

/**
 * Gets the cookie value from the passed in request then parses it
 * @throws
 */
const getCookieData = (req: Request): any => {
  let cookieValue = req.signedCookies[cookies.auth]

  !cookieValue && throwHttpException('S110', `Missing cookie value`)

  try {
    cookieValue = crypto.decrypt(cookieValue)
    return JSON.parse(cookieValue) as any
  } catch (err) {
    throwHttpException('S111', `Failed to parse cookie`, {
      cookieValue,
      err: err
    })
  }
}

/**
 * Validates the cookieData has the correct attributes
 * @throws
 */
const validateCookieAttrs = (cookieData:any): void => {
  ;(!cookieData || !cookieData.id || !cookieData.exp || !cookieData.maxAge) &&
    throwHttpException('S112', `Missing valid cookie data`, {
      ...cookieData,
    })
}

/**
 * Validates the cookies user id is in the correct format
 * @throws
 */
export const validateUserId = (cookieData: any): void => {
  !cookieData.id &&
    throwHttpException(
      'S113',
      `Invalid user id`,
      { userId: cookieData.id },
      `Invalid authentication data`
    )
}

/**
 * Validates the cookies expiration date
 * @throws
 */
const validateExpDate = (cookieData: any): void => {
  let expDate: Date

  try {
    expDate = new Date(cookieData.exp * 1000)
    expDate <= new Date() &&
    throwHttpException('S115', `Attempted to use expired auth cookie`, {
      expDate: expDate.toISOString(),
    })
  } catch (e) {
    throwHttpException(
      'S114',
      `Failed to parse cookie expiration date ${cookieData.exp}`,
      { error : e }
    )
  }

  
}

/**
 * Parses the signed request cookie
 * Ensures the cookie exists, has the correct attributes, and is not expired
 */
export const parseSessionFromCookie = (req: Request): any => {
  const cookieData: any = getCookieData(req)
  validateCookieAttrs(cookieData)
  validateUserId(cookieData)
  validateExpDate(cookieData)

  return cookieData
}

/**
 * Decrypts the signed cooke in the request
 */
export const decryptSignedCookie = (req: Request) => {
  const cookie = req.signedCookies[cookies.auth]
  return cookie && crypto.decrypt(cookie)
}
