import Joi from 'joi'
import { type TransactionType } from '../types/transaction.type'

export const createTransactionValidation = (payload: TransactionType) => {
  const schema = Joi.object({
    _id: Joi.required(),
    uuid: Joi.string().required(),
    orderCode: Joi.string().required(),
    user: Joi.required(),
    customer: Joi.string().required(),
    orders: Joi.array().required(),
    bill: Joi.number().required(),
    payment: Joi.string().required(),
    orderStatus: Joi.string().required(),
    handleCooking: Joi.string().allow(null),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().required()
  })

  return schema.validate(payload)
}

export const updateTransactionValidation = (payload: TransactionType) => {
  const schema = Joi.object({
    orderStatus: Joi.string().required(),
    handleCooking: Joi.string().allow('', null),
    updatedAt: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}
