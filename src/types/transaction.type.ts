import { type Types } from 'mongoose'
export interface TransactionType {
  _id: Types.ObjectId
  uuid: string
  orderCode: string
  user: string
  customer: string
  orders: any[]
  bill: number
  payment: string
  createdAt: string
  updatedAt: string
  orderStatus: string
}
