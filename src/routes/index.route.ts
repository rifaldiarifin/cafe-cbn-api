import { type Application, type Router } from 'express'
import HealthRouter from './health.route'
import MenuRouter from './menu.route'
import userRouter from './user.route'
import AuthRouter from './auth.route'
import TransactionRouter from './transaction.route'
import ActivityRouter from './activity.route'

const _routes: Array<[string, Router]> = [
  ['/', HealthRouter],
  ['/menu', MenuRouter],
  ['/auth', AuthRouter],
  ['/user', userRouter],
  ['/transaction', TransactionRouter],
  ['/activity', ActivityRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
