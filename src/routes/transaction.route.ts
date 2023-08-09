import express from 'express'
import {
  requireKitchenOrCashier,
  requireManager,
  requireManagerOrAdmin,
  requireRegularOrMachine,
  requireUser
} from '../middlewares/auth'
import {
  createNewTransaction,
  deleteTransaction,
  getMyTransaction,
  getTransaction,
  getTransactionByID,
  updateTransaction
} from '../controllers/transaction.controller'

const TransactionRouter = express.Router()

// http://localhost:4000/transaction

TransactionRouter.get('/', requireManagerOrAdmin, getTransaction)
TransactionRouter.get('/me', requireRegularOrMachine, getMyTransaction)
TransactionRouter.get('/:id', requireUser, getTransactionByID)
TransactionRouter.post('/', requireRegularOrMachine, createNewTransaction)
TransactionRouter.put('/:id', requireKitchenOrCashier, updateTransaction)
TransactionRouter.delete('/:id', requireManager, deleteTransaction)

export default TransactionRouter
