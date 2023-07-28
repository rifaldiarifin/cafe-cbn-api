import express from 'express'
import { requireAdmin, requireUser } from '../middlewares/auth'
import {
  createNewTransaction,
  deleteTransaction,
  getTransaction,
  getTransactionByID,
  updateTransaction
} from '../controllers/transaction.controller'

const TransactionRouter = express.Router()

TransactionRouter.get('/', requireUser, getTransaction)
TransactionRouter.get('/:id', requireUser, getTransactionByID)
TransactionRouter.post('/', requireUser, createNewTransaction)
TransactionRouter.put('/:id', requireUser, updateTransaction)
TransactionRouter.delete('/:id', requireAdmin, deleteTransaction)

export default TransactionRouter
