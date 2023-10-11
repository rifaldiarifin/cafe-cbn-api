import express from 'express'
import {
  requireKitchenOrCashier,
  requireKitchenOrCashierOrManagerOrAdmin,
  requireMachine,
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
  getTransactionThisMonth,
  getTransactionToday,
  updateTransaction
} from '../controllers/transaction.controller'

const TransactionRouter = express.Router()

// http://localhost:4000/api/transaction

TransactionRouter.get('/', requireKitchenOrCashierOrManagerOrAdmin, getTransaction)
TransactionRouter.get('/today', requireKitchenOrCashierOrManagerOrAdmin, getTransactionToday)
TransactionRouter.get('/month', requireKitchenOrCashierOrManagerOrAdmin, getTransactionThisMonth)
TransactionRouter.get('/me', requireRegularOrMachine, getMyTransaction)
TransactionRouter.get('/:id', requireUser, getTransactionByID)
TransactionRouter.post('/', requireMachine, createNewTransaction)
TransactionRouter.put('/:id', requireKitchenOrCashier, updateTransaction)
TransactionRouter.delete('/:id', requireManagerOrAdmin, deleteTransaction)

export default TransactionRouter
