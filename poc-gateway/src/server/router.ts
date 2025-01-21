import express from 'express'

const Router = express.Router()
const boundAll = Router.all.bind(Router)
const boundGet = Router.get.bind(Router)
const boundPut = Router.put.bind(Router)
const boundPost = Router.post.bind(Router)
const boundPatch = Router.patch.bind(Router)
const boundDelete = Router.delete.bind(Router)

/**
 * Helper to check if the passed in item is a function
 */
const isFunc = (item: any): boolean => item && typeof item === 'function'

/**
 * Loops the passed in handlers and wraps them in the asyncHandler method
 * Expects the first argument is a string representing the route path
 */
const wrapInAsync = (boundMethod : any, ...args: any[]) => {
  return boundMethod(
    args.shift(),
    ...args.filter(isFunc).map(async (handler) => await (handler))
  )
}

/**
 * Root Express router for the proxy API attached to the Main Express App
 * Extends the express Router, and overrides the main HTTP verb methods
 * It wraps the methods with asyncHandler so it's added by default to those methods
 */
export const AppRouter = Object.assign(Router, {
  all: (...args: Array<any>) => wrapInAsync(boundAll, ...args),
  get: (...args: Array<any>) => wrapInAsync(boundGet, ...args),
  put: (...args: Array<any>) => wrapInAsync(boundPut, ...args),
  post: (...args: Array<any>) => wrapInAsync(boundPost, ...args),
  patch: (...args: Array<any>) => wrapInAsync(boundPatch, ...args),
  delete: (...args: Array<any>) => wrapInAsync(boundDelete, ...args),
})