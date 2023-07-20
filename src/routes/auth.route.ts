import express from 'express'
import { login, refresh } from '../controllers/auth.controller'

const AuthRouter = express.Router()

// http://localhost:4000/auth

AuthRouter.post('/login', login)
AuthRouter.post('/refresh', refresh)

export default AuthRouter
