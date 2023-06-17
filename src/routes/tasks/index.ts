import express from 'express'
import {
    createTask,
    deleteTask,
    filteredTask,
    readTasks,
    updateTask,
} from '../../controllers/tasks'

const router = express.Router()

router.post('/new', createTask)

router.get('/', filteredTask)

router.delete('/delete/:task_id', deleteTask)

router.patch('/update/:task_id', updateTask)

export default router
