import Joi from 'joi'
import { type TransactionType } from '../types/transaction.type'

export const createTransactionValidation = (payload: TransactionType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.string().required(),
    orderCode: Joi.string().required(),
    customer: Joi.string().required(),
    orders: Joi.array().required(),
    bill: Joi.number().required(),
    statusOrder: Joi.string().required(),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}

export const updateTransactionValidation = (payload: TransactionType) => {
  const schema = Joi.object({
    statusOrder: Joi.string().required(),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}
