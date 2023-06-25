import express from 'express'

import { createUser, userLogin, viewProfile } from '../../controllers/profiles'
import passport, { AuthenticateCallback } from 'passport'
import { isAuthenticated } from '../../middleware/isAuthenticated'
import { handleLogin } from '../../controllers/profiles/utils/handleLogin'

const router = express.Router()

router.post('/register', createUser)

router.post('/login', handleLogin, userLogin)

router.get('/', isAuthenticated, viewProfile)

export default router
