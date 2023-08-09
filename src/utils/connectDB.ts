import { type Application } from 'express'
import mongoose from 'mongoose'
import CONFIG from '../config/environment'
import { logger } from './logger'

const connectAndStartingServer = (app: Application) => {
  const { port, db } = CONFIG
  mongoose
    .connect(`${db}`)
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
}

export default connectAndStartingServer
