import { type Request, type Response } from 'express'

export const getMenu = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    statusCode: 200,
    message: 'Success get menu!'
  })
}

export const getMenuByID = (req: Request, res: Response) => {
  res.status(201).json({
    status: 'OK',
    statusCode: 201,
    message: 'Success add menu!'
  })
}

export const addMenu = (req: Request, res: Response) => {
  res.status(201).json({
    status: 'OK',
    statusCode: 201,
    message: 'Success update menu!'
  })
}

export const updateMenu = (req: Request, res: Response) => {
  res.status(201).json({
    status: 'OK',
    statusCode: 201,
    message: 'Success update menu!'
  })
}

export const deleteMenuByID = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    statusCode: 200,
    message: 'Success delete menu!'
  })
}
