import express from 'express'
import { createSession, refresh } from '../controllers/auth.controller'

const AuthRouter = express.Router()

// http://localhost:4000/auth

AuthRouter.post('/login', createSession)
AuthRouter.post('/refresh', refresh)

export default AuthRouter
