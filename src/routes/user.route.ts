import express from 'express'
import { addUser, deleteUser, getUser, getUserByID, updateUser } from '../controllers/user.controller'
import { requireAdmin } from '../middlewares/auth'

const PersonalRouter = express.Router()

// http://localhost:4000/personal

PersonalRouter.get('/', requireAdmin, getUser)
PersonalRouter.get('/:id', requireAdmin, getUserByID)
PersonalRouter.post('/', requireAdmin, addUser)
PersonalRouter.put('/:id', requireAdmin, updateUser)
PersonalRouter.delete('/:id', requireAdmin, deleteUser)

export default PersonalRouter
