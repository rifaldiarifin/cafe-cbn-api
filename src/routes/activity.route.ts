import express from 'express'
import {
  createActivity,
  deleteActivity,
  getActivity,
  getMyActivity,
  getActivityByID,
  updateActivity
} from '../controllers/activity.controller'
import { requireAdmin, requireUser } from '../middlewares/auth'

const ActivityRouter = express.Router()

// http://localhost:4000/activity

ActivityRouter.get('/', requireAdmin, getActivity)
ActivityRouter.get('/me', requireUser, getMyActivity)
ActivityRouter.get('/:id', requireUser, getActivityByID)
ActivityRouter.post('/', requireUser, createActivity)
ActivityRouter.put('/:id', requireAdmin, updateActivity)
ActivityRouter.delete('/:id', requireAdmin, deleteActivity)

export default ActivityRouter
