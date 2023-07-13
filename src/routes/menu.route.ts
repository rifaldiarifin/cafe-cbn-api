import express from 'express'
import { addMenu, deleteMenuByID, getMenu, getMenuByID, updateMenu } from '../controllers/menu.controller'

const MenuRouter = express.Router()

// http://localhost:4000/menubook

MenuRouter.get('/', getMenu)
MenuRouter.get('/:id', getMenuByID)
MenuRouter.post('/', addMenu)
MenuRouter.put('/:id', updateMenu)
MenuRouter.delete('/:id', deleteMenuByID)

export default MenuRouter
