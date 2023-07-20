import { type Response } from 'express'

const responseHandler = (
  [status, statusCode, message, result]: [string | boolean, number, string, object | any[] | undefined],
  res: Response
) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    result
  })
}

export default responseHandler
