import { type Request, type Response, type NextFunction } from 'express'
import responseHandler from '../utils/responsehandle'

export const requireRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refresh_token
  if (!refreshToken) return responseHandler([false, 403, 'Invalid Token', []], res)

  return next()
}

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) {
    return responseHandler([false, 403, 'Invalid Token', []], res)
  }
  return next()
}

export const requireMachine = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'machine') return responseHandler([false, 403, 'Invalid Token', []], res)
  return next()
}

export const requireKitchen = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'kitchen') return responseHandler([false, 403, 'Invalid Token', []], res)
  return next()
}

export const requireCashier = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'cashier') return responseHandler([false, 403, 'Invalid Token', []], res)
  return next()
}

export const requireManager = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'manager') return responseHandler([false, 403, 'Invalid Token', []], res)
  return next()
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'admin') return responseHandler([false, 403, 'Invalid Token', []], res)
  return next()
}

export const requireKitchenOrCashier = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'kitchen' && user.role !== 'cashier') {
    return responseHandler([false, 403, 'Invalid Token', []], res)
  }
  return next()
}

export const requireRegularOrMachine = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'regular' && user.role !== 'machine') {
    return responseHandler([false, 403, 'Invalid Token', []], res)
  }
  return next()
}

export const requireManagerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'admin' && user.role !== 'manager') {
    return responseHandler([false, 403, 'Invalid Token', []], res)
  }
  return next()
}

export const requireKitchenOrCashierOrManagerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) return responseHandler([false, 403, 'Invalid Token', []], res)
  if (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'cashier' && user.role !== 'kitchen') {
    return responseHandler([false, 403, 'Invalid Token', []], res)
  }
  return next()
}
