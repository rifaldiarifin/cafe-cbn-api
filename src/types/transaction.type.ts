export interface TransactionType {
  _id: string
  uuid: string
  orderCode: string
  customer: string
  orders: object[]
  bill: number
  createdAt: string
  updatedAt: string
  statusOrder: string
}
