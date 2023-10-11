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
      origin: [
        'http://localhost:3000',
        'http://localhost:4173',
        'https://cafecbn.netlify.app',
        'http://192.168.43.102:3000',
        'http://223.255.227.12:3000'
      ],
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
