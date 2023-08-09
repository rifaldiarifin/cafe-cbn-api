import express, { type Response, type Application, type NextFunction } from 'express'
import bodyParser from 'body-parser'
import deserializeToken from '../middlewares/deserializedToken'
import cors from 'cors'
import { routes } from '../routes/index.route'

const createServer = () => {
  const app: Application = express()

  // body parse data
  app.use(bodyParser.json({ limit: '30mb' }))
  app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

  // CORS Handler
  app.use(cors())
  app.use((_, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
  })

  app.use(deserializeToken)

  // Routes
  routes(app)

  return app
}

export default createServer
