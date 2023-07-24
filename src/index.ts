import express, { type Application, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { routes } from './routes/index.route'
import bodyParser from 'body-parser'
import CONFIG from './config/environment'

// Connect Database
import './utils/connectDB'

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

app.listen(port, () => console.log(`Server running on port ${port}`))
