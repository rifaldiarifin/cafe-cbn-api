import { type Request, type Response, type NextFunction } from 'express'

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) {
    return res.sendStatus(403)
  }
  return next()
}

export const requireManager = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return res.sendStatus(403)
  if (user.role !== 'manager') return res.sendStatus(403)
  return next()
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return res.sendStatus(403)
  if (user.role !== 'admin') return res.sendStatus(403)
  return next()
}

export const requireManagerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return res.sendStatus(403)
  if (user.role !== 'admin' && user.role !== 'manager') {
    return res.sendStatus(403)
  }
  return next()
}
