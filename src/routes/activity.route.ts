import express from 'express'
import {
  createActivity,
  deleteActivity,
  getActivity,
  getMyActivity,
  getActivityByID,
  updateActivity
} from '../controllers/activity.controller'
import { requireUser } from '../middlewares/auth'

const ActivityRouter = express.Router()

// http://localhost:4000/activity

ActivityRouter.get('/', requireUser, getActivity)
ActivityRouter.get('/me', requireUser, getMyActivity)
ActivityRouter.get('/:id', requireUser, getActivityByID)
ActivityRouter.post('/', requireUser, createActivity)
ActivityRouter.put('/:id', requireUser, updateActivity)
ActivityRouter.delete('/:id', requireUser, deleteActivity)

export default ActivityRouter
