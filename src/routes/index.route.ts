import { type Application, type Router } from 'express'
import HealthRouter from './health.route'
import MenuRouter from './menu.route'

const _routes: Array<[string, Router]> = [
  ['/', HealthRouter],
  ['/menu', MenuRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
