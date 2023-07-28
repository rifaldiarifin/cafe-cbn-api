import { type Application, type Router } from 'express'
import HealthRouter from './health.route'
import MenuRouter from './menu.route'
import PersonalRouter from './personal.route'
import AuthRouter from './auth.route'
import TransactionRouter from './transaction.route'

const _routes: Array<[string, Router]> = [
  ['/', HealthRouter],
  ['/menu', MenuRouter],
  ['/auth', AuthRouter],
  ['/personal', PersonalRouter],
  ['/transaction', TransactionRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
