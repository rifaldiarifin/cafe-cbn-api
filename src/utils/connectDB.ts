import mongoose from 'mongoose'
import CONFIG from '../config/environment'
import { logger } from './logger'

mongoose
  .connect(`${CONFIG.db}`)
  .then(() => {
    logger.info('Connected to mongoDB')
  })
  .catch((error: any) => {
    logger.error('Could not connect to mongoDB')
    logger.error(error.message)
    process.exit(1)
  })
