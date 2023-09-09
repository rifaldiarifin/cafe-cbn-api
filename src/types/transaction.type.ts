export interface TransactionType {
  _id: string
  uuid: string
  orderCode: string
  user: string
  customer: string
  orders: any[]
  bill: number
  createdAt: string
  updatedAt: string
  orderStatus: string
}
