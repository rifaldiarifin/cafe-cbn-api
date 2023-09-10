import express, { type Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import deserializeToken from '../middlewares/deserializedToken'
import cors from 'cors'
import { routes } from '../routes/index.route'

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
      origin: ['http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    })
  )

  app.use(deserializeToken)

  // Routes
  routes(app)

  return app
}

export default createServer
