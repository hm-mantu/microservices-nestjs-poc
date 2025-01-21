import { default as CreateProxyMiddleware, createProxyMiddleware }from 'http-proxy-middleware'

export const createProxy = (createProxyMiddleware ??
  CreateProxyMiddleware) as unknown as typeof createProxyMiddleware