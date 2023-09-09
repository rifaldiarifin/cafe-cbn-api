import { type Request, type Response } from 'express'
import { logger } from '../utils/logger'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import responseHandler from '../utils/responsehandle'
import { timestamps } from '../utils/date'
import transactionCode from '../utils/transactionCodeGenerate'
import { createTransactionValidation, updateTransactionValidation } from '../validations/transaction.validation'
import {
  createTransaction,
  deleteTransactionByID,
  findMyTransaction,
  findTransaction,
  findTransactionByID,
  updateTransactionByID
} from '../services/transaction.service'
import { findMenuOnlyByIDFromDB, updateSoldMenuFromDB } from '../services/menu.service'
import { findIdUserByUuid } from '../services/user.service'

// CREATE
export const createNewTransaction = async (req: Request, res: Response) => {
  const getIDofOrder = async () => {
    const catchIDOfOrder: any[] = []
    const catchPriceOfOrder: number[] = []
    for (let x = 0; x < req.body.orders.length; x++) {
      const order = req.body.orders[x]
      const dataOrder: any = await findMenuOnlyByIDFromDB(order.uuid)
      await updateSoldMenuFromDB(order.uuid, parseInt(dataOrder.sold) + parseInt(order.qty))
      for (let z = 0; z < order.qty; z++) {
        catchPriceOfOrder.push(dataOrder.price)
      }
      catchIDOfOrder.push({ order: dataOrder._id, qty: order.qty })
    }
    const bill = catchPriceOfOrder.reduce((total, curr) => {
      return total + curr
    })
    return [catchIDOfOrder, bill]
  }

  const ordersid = await getIDofOrder()
  const transid = new mongoose.Types.ObjectId()
  const { _id }: any = await findIdUserByUuid(res.locals.user.uuid)

  req.body._id = transid
  req.body.uuid = uuidv4()
  req.body.orderCode = transactionCode()
  req.body.user = _id
  req.body.orders = ordersid[0]
  req.body.bill = ordersid[1]
  req.body.orderStatus = 'Pending'
  req.body.createdAt = timestamps()
  req.body.updatedAt = timestamps()

  const { error, value } = createTransactionValidation(req.body)

  if (error) {
    logger.error(`ERROR: Transaction - Create = ${error.details[0].message}`)
    return responseHandler([false, 422, `ERROR: Transaction - Create = ${error.details[0].message}`, []], res)
  }

  try {
    // console.log(value)
    await createTransaction(value)
    logger.info('Success create transaction')
    return responseHandler(['Created', 201, 'Success create transaction', value], res)
  } catch (error: any) {
    logger.error(`ERROR: Transaction - Create = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Transaction - Create = ${error.message}`, []], res)
  }
}

// READ
export const getTransaction = async (req: Request, res: Response) => {
  try {
    const result: any = await findTransaction()
    logger.info('Success get all transaction')
    responseHandler(['OK', 200, 'Success get all transaction', result], res)
  } catch (error: any) {
    logger.error(`ERROR: Transaction - Get All = ${error.message}`)
    responseHandler([false, 422, `ERROR: Transaction - Get All = ${error.message}`, []], res)
  }
}

export const getTransactionByID = async (req: Request, res: Response) => {
  const id: string = req.params.id

  try {
    const result: any = await findTransactionByID(id)
    if (!result) {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    logger.info('Success get transaction')
    return responseHandler(['OK', 200, 'Success get transaction', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Transaction - Get = ${error.message}`)
    responseHandler([false, 422, `ERROR: Transaction - Get = ${error.message}`, []], res)
  }
}
export const getMyTransaction = async (req: Request, res: Response) => {
  const id: string = res.locals.user.uuid

  try {
    const { _id }: any = await findIdUserByUuid(id)
    const result: any = await findMyTransaction(_id)
    logger.info('Success get your transaction')
    return responseHandler(['OK', 200, 'Success get your transaction', result], res)
  } catch (error: any) {
    logger.info(`ERROR: Transaction - Get = ${error.message}`)
    responseHandler([false, 422, `ERROR: Transaction - Get = ${error.message}`, []], res)
  }
}

// UPDATE
export const updateTransaction = async (req: Request, res: Response) => {
  const id: string = req.params.id
  req.body.updatedAt = timestamps()

  const { error, value } = updateTransactionValidation(req.body)
  if (error) {
    logger.error(`ERROR: Transaction - Update = ${error.details[0].message}`)
    return responseHandler([false, 422, `ERROR: Transaction - Update = ${error.details[0].message}`, []], res)
  }

  try {
    await updateTransactionByID(id, value)
    logger.info('Success update transaction')
    return responseHandler(['OK', 200, 'Success update transaction', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Transaction - Update = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Transaction - Update = ${error.message}`, []], res)
  }
}

export const deleteTransaction = async (req: Request, res: Response) => {
  const id: string = req.params.id

  try {
    const check: any = await deleteTransactionByID(id)
    if (!check) {
      logger.info('Data not found')
      return responseHandler([false, 404, 'Data not found', []], res)
    }
    if (check.orderStatus !== 'Done') {
      logger.info('Transaction has not been completed, please try again later')
      return responseHandler([false, 422, 'Transaction has not been completed, please try again later', []], res)
    }
    logger.info('Success delete transaction')
    return responseHandler(['OK', 200, 'Success delete transaction', []], res)
  } catch (error: any) {
    logger.error(`ERROR: Transaction - Delete = ${error.message}`)
    return responseHandler([false, 422, `ERROR: Transaction - Delete = ${error.message}`, []], res)
  }
}
