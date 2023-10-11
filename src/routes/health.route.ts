import express, { type Request, type Response } from 'express'

const HealthRouter = express.Router()

// http://localhost:4000/api

HealthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    statusCode: 200,
    message: 'Server is running...'
  })
})

export default HealthRouter
