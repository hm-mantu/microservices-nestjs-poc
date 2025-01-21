export const authRoutes = [
    '/login',
    '/logout',
    '/session',
    '/me',
    '/health-check',
] as const

export const bypassAuthRoutes = ['/', '/health-check']

export const cookies = {
    auth: 'auth-cookie',
} as const

export const BEARER_PREFIX = 'Bearer '

export const JWT_CONSTANTS = {
    ISSUER: 'HAPPIESTMINDS',
}

export const LOCALS_JWT_PATH = 'locals.jwt.userInfo'