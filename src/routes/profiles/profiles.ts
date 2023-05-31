import express from 'express'

import {
    createUser,
    getProtectedProfile,
    getUsers,
    userLogin,
} from '../../controllers/profiles'
import passport from 'passport'

const router = express.Router()

router.post('/register', createUser)

router.post('/login', passport.authenticate('local'), userLogin)

export default router
