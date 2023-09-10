import express from 'express'
import { createSession, refreshSession } from '../controllers/auth.controller'
import { requireRefreshToken } from '../middlewares/auth'

const AuthRouter = express.Router()

// http://localhost:4000/auth

AuthRouter.post('/login', createSession)
AuthRouter.post('/refresh', requireRefreshToken, refreshSession)

export default AuthRouter
