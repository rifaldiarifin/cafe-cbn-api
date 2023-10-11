import { type Application, type Router } from 'express'
import HealthRouter from './health.route'
import MenuRouter from './menu.route'
import userRouter from './user.route'
import AuthRouter from './auth.route'
import TransactionRouter from './transaction.route'
import ActivityRouter from './activity.route'
import WelcomeRouter from './welcome.route'

const _routes: Array<[string, Router]> = [
  ['/', WelcomeRouter],
  ['/api', HealthRouter],
  ['/api/menu', MenuRouter],
  ['/api/auth', AuthRouter],
  ['/api/user', userRouter],
  ['/api/transaction', TransactionRouter],
  ['/api/activity', ActivityRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
