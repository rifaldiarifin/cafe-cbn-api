import mongoose, { Schema } from 'mongoose'

const transactionSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: String,
    unique: true
  },
  orderCode: {
    type: String,
    unique: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'userData' },
  customer: String,
  orders: [
    {
      order: { type: Schema.Types.ObjectId, ref: 'menuData' },
      qty: Number
    }
  ],
  bill: Number,
  payment: String,
  handleCooking: {
    type: String,
    default: 'nothing'
  },
  orderStatus: String,
  createdAt: String,
  updatedAt: String
})

export const TransactionDocumentModel = mongoose.model('transactionData', transactionSchema, 'transactionData')
