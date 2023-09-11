import express from 'express'
import { clearSession, createSession, refreshSession, verifyToken } from '../controllers/auth.controller'
import { requireRefreshToken } from '../middlewares/auth'

const AuthRouter = express.Router()

// http://localhost:4000/auth

AuthRouter.post('/login', createSession)
AuthRouter.get('/refresh', requireRefreshToken, refreshSession)
AuthRouter.post('/verify', verifyToken)
AuthRouter.get('/logout', clearSession)

export default AuthRouter
