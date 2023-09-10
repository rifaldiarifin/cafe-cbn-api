import express, { type Response, type Application, type NextFunction } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import deserializeToken from '../middlewares/deserializedToken'
import cors from 'cors'
import { routes } from '../routes/index.route'
import allowOrigins from '../config/allowOrigins'

const createServer = () => {
  const app: Application = express()

  // body parse data
  app.use(bodyParser.json({ limit: '30mb' }))
  app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

  // Cookie Parser
  app.use(cookieParser())

  // CORS Handler
  app.use(
    cors({
      origin: allowOrigins
    })
  )
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
