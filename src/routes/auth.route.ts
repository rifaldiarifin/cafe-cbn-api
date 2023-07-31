import express from 'express'
import { createSession, refreshSession } from '../controllers/auth.controller'

const AuthRouter = express.Router()

// http://localhost:4000/auth

AuthRouter.post('/login', createSession)
AuthRouter.post('/refresh', refreshSession)

export default AuthRouter
