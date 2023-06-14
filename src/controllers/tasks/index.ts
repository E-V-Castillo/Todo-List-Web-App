import { Request, Response } from 'express'
import taskModel from '../../models/task'
import { TaskFilter } from '../../types/task.interface'

export const createTask = async (req: Request, res: Response) => {
    // This stuff will come from a payload from my frontend
    try {
        const { title, description, deadline, is_notified, task_priority_id } =
            req.body

        if (req.user?.profile_id) {
            const profile_id = req.user.profile_id
            const result = await taskModel.createTask({
                title,
                description,
                deadline,
                is_notified,
                task_priority_id,
                profile_id,
            })
            res.status(201).json(result)
        }
    } catch (error) {
        res.status(500).json({ Error: 'Error creating a task' })
    }
}

export const readTasks = async (req: Request, res: Response) => {
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user.profile_id
            const result = await taskModel.readAllTasksFromUser(profile_id)

            res.status(200).json({ result })
        } else {
            res.status(401).json({ Error: 'You are not logged in' })
        }
    } catch (error) {}
}

export const filteredTask = async (req: Request, res: Response) => {
    try {
        if (req.user?.profile_id != undefined) {
            const { completed, title, priority, startDate, endDate } = req.query

            // req.query only returns undefined, SQL does not have a definition for undefined so we need to change the type into null or as the value that sql can understand like boolean or string

            const filters: TaskFilter = {
                completedQuery:
                    completed === undefined ? null : completed === 'true',
                titleQuery: title === undefined ? null : (title as string),
                priorityQuery:
                    priority === undefined
                        ? null
                        : parseInt(priority as string),
                startDateQuery:
                    startDate === undefined
                        ? null
                        : new Date(startDate as string),
                endDateQuery:
                    endDate === undefined ? null : new Date(endDate as string),
            }

            console.log(filters)

            const result = await taskModel.readTaskWithFilter(
                req.user.profile_id,
                filters
            )
            res.status(200).json(result)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ Error: 'Internal Server Error' })
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user.profile_id
            const task_id = parseInt(req.params.task_id)
            await taskModel.deleteTask(task_id, profile_id)

            res.status(200).send('Successful Deletion')
        } else {
            res.status(401).json({ Error: 'You are not logged in' })
        }
    } catch (error) {
        res.status(500).json({ Error: error })
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user.profile_id
            const task_id = parseInt(req.params.task_id)
            const {
                title,
                description,
                deadline,
                is_completed,
                is_notified,
                task_priority_id,
            } = req.body

            const result = await taskModel.updateTask({
                task_id,
                profile_id,
                title,
                description,
                deadline,
                is_completed,
                is_notified,
                task_priority_id,
            })

            res.status(200).json({ result })
        } else {
            res.status(401).json({ Error: 'You are not logged in' })
        }
    } catch (error) {
        res.status(500).json({ Error: error })
    }
}
