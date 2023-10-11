import express, { type Request, type Response } from 'express'

const WelcomeRouter = express.Router()

// http://localhost:4000

WelcomeRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    statusCode: 200,
    message: 'Hello!, Welcome to Cafe CBN API'
  })
})

export default WelcomeRouter
