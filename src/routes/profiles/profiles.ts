import express from 'express'
const router = express.Router()

import { createUser, getUsers } from '../../controllers/profile'

router.get('/', getUsers)
router.post('/', createUser)

export default router
