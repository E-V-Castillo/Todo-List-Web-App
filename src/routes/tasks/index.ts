import express, { NextFunction, Request, Response } from 'express'
import {
    createTask,
    deleteTask,
    readTask,
    updateTask,
} from '../../controllers/tasks'

const router = express.Router()

router.post('/', createTask)

router.post(
    '/experiment',
    (req: Request, res: Response, next: NextFunction) => {
        const data = req.body
        console.log(typeof data.array[0])
        res.end()
    }
)

router.get('/', readTask)

router.delete('/:task_id', deleteTask)

router.patch('/:task_id', updateTask)

export default router
