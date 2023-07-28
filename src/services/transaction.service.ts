import { TransactionDocumentModel } from '../models/transaction.model'
import { type TransactionType } from '../types/transaction.type'

// CREATE
export const createTransaction = async (payload: TransactionType) => {
  return await TransactionDocumentModel.create(payload)
}

// READ
export const findTransaction = async () => {
  return await TransactionDocumentModel.find().populate('orders').exec()
}
export const findTransactionByID = async (uuid: string) => {
  return await TransactionDocumentModel.findOne({ uuid }).populate('orders').exec()
}

// UPDATE
export const updateTransactionByID = async (uuid: string, payload: TransactionType) => {
  return await TransactionDocumentModel.updateOne({ uuid }, { $set: payload })
}

// DELETE
export const deleteTransactionByID = async (uuid: string) => {
  return await TransactionDocumentModel.deleteOne({ uuid })
}
