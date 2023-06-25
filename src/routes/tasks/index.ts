import express from 'express'
import {
    createTask,
    deleteTask,
    readTask,
    updateTask,
} from '../../controllers/tasks'

const router = express.Router()

router.post('/', createTask)

router.get('/', readTask)

router.delete('/:task_id', deleteTask)

router.patch('/:task_id', updateTask)

export default router
