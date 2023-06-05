import express from 'express'

import {
    createUser,
    getProtectedProfile,
    getUsers,
    userLogin,
    viewProfile,
} from '../../controllers/profiles'
import passport from 'passport'

const router = express.Router()

router.post('/register', createUser)

router.post('/login', passport.authenticate('local'), userLogin)

router.get('/', passport.authorize('local'), viewProfile)

export default router
