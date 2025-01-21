import { createProxyMiddleware } from 'http-proxy-middleware'
import { default as CreateProxyMiddleware } from 'http-proxy-middleware'

export const createProxy = (createProxyMiddleware ??
  CreateProxyMiddleware) as unknown as typeof createProxyMiddleware