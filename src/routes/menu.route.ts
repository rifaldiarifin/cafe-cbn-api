import express from 'express'
import {
  addMenu,
  addMenuGroup,
  addRatings,
  deleteMenuByID,
  deleteMenuGroupByID,
  getMenu,
  getMenuByID,
  getMenuGroupByID,
  getMenuGroups,
  getRatingByID,
  getRatingByUser,
  updateMenu,
  updateMenuGroup,
  updateMenusInGroup,
  updateRatings,
  getMenuGroupOnlyUuidMenusByID,
  getMenuGroupsOnlyUuid
} from '../controllers/menu.controller'
import { requireManagerOrAdmin, requireUser } from '../middlewares/auth'

const MenuRouter = express.Router()

// http://localhost:4000/api/menu

MenuRouter.get('/', requireUser, getMenu)
MenuRouter.get('/groups', requireUser, getMenuGroups)
MenuRouter.get('/uuidgroups', requireUser, getMenuGroupsOnlyUuid)
MenuRouter.get('/groups/:id', requireUser, getMenuGroupByID)
MenuRouter.get('/uuidgroups/:id', requireUser, getMenuGroupOnlyUuidMenusByID)
MenuRouter.get('/:id', requireUser, getMenuByID)
MenuRouter.get('/rate/user', requireUser, getRatingByUser)
MenuRouter.get('/rate/:id', requireUser, getRatingByID)
MenuRouter.post('/', requireManagerOrAdmin, addMenu)
MenuRouter.post('/rate', requireUser, addRatings)
MenuRouter.post('/groups', requireManagerOrAdmin, addMenuGroup)
MenuRouter.put('/:id', requireManagerOrAdmin, updateMenu)
MenuRouter.put('/rate/:id', requireUser, updateRatings)
MenuRouter.put('/groups/:id', requireManagerOrAdmin, updateMenuGroup)
MenuRouter.put('/groups/:id/menus/:option', requireManagerOrAdmin, updateMenusInGroup)
MenuRouter.delete('/:id', requireManagerOrAdmin, deleteMenuByID)
MenuRouter.delete('/groups/:id', requireManagerOrAdmin, deleteMenuGroupByID)

export default MenuRouter
