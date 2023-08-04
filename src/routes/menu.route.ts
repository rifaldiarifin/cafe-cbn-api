import express from 'express'
import {
  addMenu,
  addRatings,
  deleteMenuByID,
  getMenu,
  getMenuByID,
  updateMenu,
  updateRatings
} from '../controllers/menu.controller'
import { requireManagerOrAdmin, requireUser } from '../middlewares/auth'

const MenuRouter = express.Router()

// http://localhost:4000/menu

MenuRouter.get('/', requireUser, getMenu)
MenuRouter.get('/:id', requireUser, getMenuByID)
MenuRouter.post('/', requireManagerOrAdmin, addMenu)
MenuRouter.post('/rate', requireManagerOrAdmin, addRatings)
MenuRouter.put('/edit/:id', requireManagerOrAdmin, updateMenu)
MenuRouter.put('/rate/:id', requireUser, updateRatings)
MenuRouter.delete('/:id', requireManagerOrAdmin, deleteMenuByID)

export default MenuRouter
