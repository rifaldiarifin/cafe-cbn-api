import express from 'express'
import {
  addMenu,
  addRatings,
  deleteMenuByID,
  getMenu,
  getMenuByID,
  getRatingByID,
  getRatingByUser,
  updateMenu,
  updateRatings
} from '../controllers/menu.controller'
import { requireManagerOrAdmin, requireUser } from '../middlewares/auth'

const MenuRouter = express.Router()

// http://localhost:4000/menu

MenuRouter.get('/', requireUser, getMenu)
MenuRouter.get('/:id', requireUser, getMenuByID)
MenuRouter.get('/rate/user', requireUser, getRatingByUser)
MenuRouter.get('/rate/:id', requireUser, getRatingByID)
MenuRouter.post('/', requireManagerOrAdmin, addMenu)
MenuRouter.post('/rate', requireUser, addRatings)
MenuRouter.put('/:id', requireManagerOrAdmin, updateMenu)
MenuRouter.put('/rate/:id', requireUser, updateRatings)
MenuRouter.delete('/:id', requireManagerOrAdmin, deleteMenuByID)

export default MenuRouter
