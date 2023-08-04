import express, { type Application, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { routes } from './routes/index.route'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import CONFIG from './config/environment'
import { logger } from './utils/logger'
import deserializeToken from './middlewares/deserializedToken'

const app: Application = express()
const port: number = CONFIG.port

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

// Connect to Database then start the server
mongoose
  .connect(`${CONFIG.db}`)
  .then(() => {
    logger.info('Connected to mongoDB...')
    app.listen(port, () =>
      setTimeout(() => {
        logger.info(`
      
      Server running on port ${port}
      http://localhost:${port}
      `)
      }, 800)
    )
  })
  .catch((error: any) => {
    logger.error(`Could not connect to Database, Please check your connection and restart server
      ERR: Server - Starting = ${error.message}
    `)
    process.exit(1)
  })
