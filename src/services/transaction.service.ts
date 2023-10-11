import { dateMonthAndYearNow, dateNow } from '../utils/date'
import { TransactionDocumentModel } from '../models/transaction.model'
import { type TransactionType } from '../types/transaction.type'

// CREATE
export const createTransaction = async (payload: TransactionType) => {
  return await TransactionDocumentModel.create(payload)
}

// READ
export const findTransaction = async () => {
  return await TransactionDocumentModel.find()
    .populate('orders.order', 'uuid menuCode name image price')
    .select('_id uuid orderCode customer bill orders.qty payment orderStatus handleCooking createdAt updatedAt')
}
export const findTransactionToday = async () => {
  return await TransactionDocumentModel.find({ createdAt: { $regex: '.*' + dateNow() + '.*' } })
    .populate('orders.order', 'uuid menuCode name image price')
    .select('_id uuid orderCode customer bill orders.qty payment orderStatus handleCooking createdAt updatedAt')
}
export const findCompleteTransactionThisMonth = async () => {
  return await TransactionDocumentModel.find({
    createdAt: { $regex: '.*' + dateMonthAndYearNow() + '.*' },
    orderStatus: 'complete'
  })
    .populate('orders.order', 'uuid menuCode name image price')
    .select('_id uuid orderCode customer bill orders.qty payment orderStatus handleCooking createdAt updatedAt')
}
export const findMyTransaction = async (user: string) => {
  return await TransactionDocumentModel.find({ user })
    .populate('orders.order', 'uuid menuCode name image price')
    .select('_id uuid orderCode customer bill orders.qty payment orderStatus handleCooking createdAt updatedAt')
}
export const findTransactionByID = async (uuid: string) => {
  return await TransactionDocumentModel.findOne({ uuid })
    .populate('orders.order', 'uuid menuCode name image price')
    .select('_id uuid orderCode customer bill orders.qty payment orderStatus handleCooking createdAt updatedAt')
}
export const findStatusTransactionByID = async (uuid: string) => {
  return await TransactionDocumentModel.findOne({ uuid }).select('-_id uuid orderCode orderStatus handleCooking')
}

// UPDATE
export const updateTransactionByID = async (uuid: string, payload: TransactionType) => {
  return await TransactionDocumentModel.updateOne({ uuid }, { $set: payload })
}

// DELETE
export const deleteTransactionByID = async (uuid: string) => {
  return await TransactionDocumentModel.deleteOne({ uuid }).select('-_id uuid orderCode')
}
