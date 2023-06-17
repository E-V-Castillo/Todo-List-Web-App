import express from 'express'

import { createUser, userLogin, viewProfile } from '../../controllers/profiles'
import passport from 'passport'
import { isAuthenticated } from '../../middleware/isAuthenticated'

const router = express.Router()

router.post('/register', createUser)

router.post('/login', passport.authenticate('local'), userLogin)

router.get('/', isAuthenticated, viewProfile)

export default router
