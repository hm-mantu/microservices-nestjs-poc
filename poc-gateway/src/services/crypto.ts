import crypto from 'crypto'
import { app } from '../server/app'

const algorithm = 'aes-256-gcm'
const KEY_LENGTH = 32
const AUTH_TAG_LENGTH = 16
const IV_LENGTH = 12

const getKey = () => {
  const key = Buffer.from(app.locals.config.encryptionSecret, 'hex')

  if (app.locals.config.encryptionSecret.length !== KEY_LENGTH * 2) {
    throw new Error(`Encryption Secret must have ${KEY_LENGTH * 2} hex characters`)
  }
  return key
}

export const encrypt = (plainText: string): string => {
  const key = getKey()
  const initVector = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(algorithm, key, initVector, {
    authTagLength: AUTH_TAG_LENGTH,
  })

  const cypherText =
    initVector.toString('hex') +
    cipher.update(plainText, 'utf-8', 'hex') +
    cipher.final('hex')

  return cipher.getAuthTag().toString('hex') + cypherText
}

export const decrypt = (encryptedText: string): string => {
  const key = getKey()
  const authTag = Buffer.from(encryptedText.substring(0, AUTH_TAG_LENGTH * 2), 'hex')
  const initVector = Buffer.from(
    encryptedText.substring(AUTH_TAG_LENGTH * 2, AUTH_TAG_LENGTH * 2 + IV_LENGTH * 2),
    'hex'
  )
  const cypherText = encryptedText.substring(AUTH_TAG_LENGTH * 2 + IV_LENGTH * 2)
  const decipher = crypto.createDecipheriv(algorithm, key, initVector, {
    authTagLength: AUTH_TAG_LENGTH,
  })
  decipher.setAuthTag(authTag)

  return decipher.update(cypherText, 'hex', 'utf-8') + decipher.final('utf8')
}
