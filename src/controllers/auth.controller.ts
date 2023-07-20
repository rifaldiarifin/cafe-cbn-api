import { type Request, type Response } from 'express'

export const login = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Success login!'
  })
}

export const refresh = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Success refresh!'
  })
}
