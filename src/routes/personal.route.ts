import express from 'express'
import { addUser, deleteUser, getUser, getUserByID, updateUser } from '../controllers/personal.controller'

const PersonalRouter = express.Router()

// http://localhost:4000/personal

PersonalRouter.get('/', getUser)
PersonalRouter.get('/:id', getUserByID)
PersonalRouter.post('/', addUser)
PersonalRouter.put('/:id', updateUser)
PersonalRouter.delete('/:id', deleteUser)

export default PersonalRouter
