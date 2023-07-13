import express, { type Application } from 'express'
import cors from 'cors'
import { routes } from './routes/index.route'
import bodyParser from 'body-parser'
import CONFIG from './config/environment'

const app: Application = express()

// body parse data
app.use(bodyParser.json({ limit: '30mb' }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

// CORS Handler
app.use(cors())

// Routes
routes(app)

app.listen(CONFIG.port, () => console.log(`Server running on port ${CONFIG.port}`))
