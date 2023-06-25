import { NextFunction, Request, Response } from 'express'
import taskModel from '../../models/task'
import { TaskFilter } from '../../types/task.interface'
import { z } from 'zod'
import { CustomError } from '../../types/errors/CustomError'

import { ErrorFactory } from '../../utils/ErrorFactory'

const errorFactory = new ErrorFactory()

const CreateTaskSchema = z.object({
    title: z.string().max(300).min(1),
    description: z.string().nullish(),
    deadline: z.string().datetime(),
    is_notified: z.enum(['true', 'false'], {
        errorMap: (issue, _ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                if (issue.received !== 'true' && issue.received !== 'false') {
                    return {
                        message:
                            'Notification state must be a true or false value',
                    }
                }
            } else if (issue.code === z.ZodIssueCode.invalid_type) {
                if (
                    issue.received === 'null' ||
                    issue.received === 'undefined'
                ) {
                    return { message: 'Notification state is required' }
                }
            }
            return { message: 'Internal server error' }
        },
    }),

    task_priority_id: z.coerce.number(),
    profile_id: z.number(),
})

// interface TaskFilter {
//     completedQuery: boolean | null
//     titleQuery: string | null
//     priorityQuery: number | null
//     startDateQuery: Date | null
//     endDateQuery: Date | null
// }

export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // This stuff will come from a payload from my frontend
    try {
        const { title, description, deadline, is_notified, task_priority_id } =
            req.body

        if (req.user?.profile_id) {
            const profile_id = req.user.profile_id
            const schemaResult = CreateTaskSchema.safeParse({
                title,
                description,
                deadline,
                is_notified,
                task_priority_id,
                profile_id,
            })
            if (!schemaResult.success) {
                throw schemaResult.error
            }
            const converted_task_priority_id = parseInt(task_priority_id)
            let converted_is_notified
            if (is_notified === 'true') {
                converted_is_notified = true
            } else {
                converted_is_notified = false
            }

            const result = await taskModel.createTask({
                title,
                description,
                deadline,
                converted_is_notified,
                converted_task_priority_id,
                profile_id,
            })
            res.status(201).json({ result: result })
        } else {
            throw new CustomError(
                401,
                'User is not authorized',
                new Error('User is not authorized')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}

// FIX THIS

const ReadTaskFiltersSchema = z
    .object({
        completed: z
            .enum(['true', 'false'], {
                errorMap: (issue, _ctx) => {
                    if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                        if (
                            issue.received !== 'true' &&
                            issue.received !== 'false'
                        ) {
                            return {
                                message:
                                    'Completion state must be a true or false value',
                            }
                        }
                    }
                    if (issue.code === z.ZodIssueCode.invalid_type) {
                        if (issue.received !== 'string') {
                            return {
                                message:
                                    'Completion state must be provided in string format',
                            }
                        }
                    }

                    return { message: 'Internal server error' }
                },
            })
            .nullish(),
        title: z
            .string()
            .max(300, {
                message: 'Title must not be longer than 300 characters',
            })
            .min(1, { message: 'Title must not be shorter than 1 character' })
            .nullish(),
        priority: z
            .string({ invalid_type_error: 'Priority must be a string' })
            .nullish(),
        startDate: z.coerce.date().nullish(),
        endDate: z.coerce.date().nullish(),
    })
    .optional()

export const readTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user?.profile_id != undefined) {
            const { completed, title, priority, startDate, endDate } = req.query
            const schemaResult = ReadTaskFiltersSchema.safeParse({
                completed,
                title,
                priority,
                startDate,
                endDate,
            })
            if (!schemaResult.success) {
                throw schemaResult.error
            }

            // req.query only returns undefined, SQL does not have a definition for undefined so we need to change the type into null or as the value that sql can understand like boolean or string
            let completedValue: boolean | null
            if (completed === undefined) {
                completedValue = null
            } else if (completed === 'true') {
                completedValue = true
            } else if (completed === 'false') {
                completedValue = false
            }

            const filters: TaskFilter = {
                completedQuery: completedValue!,

                titleQuery: title === undefined ? null : (title as string),
                priorityQuery:
                    priority === undefined ? null : (priority as string),
                startDateQuery:
                    startDate === undefined
                        ? null
                        : new Date(startDate as string),
                endDateQuery:
                    endDate === undefined ? null : new Date(endDate as string),
            }

            const result = await taskModel.readTaskWithFilter(
                req.user.profile_id,
                filters
            )
            res.status(200).json({ result: result })
        } else {
            throw new CustomError(
                401,
                'User is not authorized',
                new Error('User is not authorized')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}

const UpdateTaskSchema = z.object({
    task_id: z.number(),
    profile_id: z.number(),
    title: z
        .string()
        .max(300, { message: 'Title must be shorter than 300 characters' })
        .min(1, { message: 'Title must not be empty' }),
    description: z.string().nullish(),
    deadline: z.string().datetime(),
    is_notified: z.enum(['true', 'false'], {
        errorMap: (issue, _ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                if (issue.received !== 'true' && issue.received !== 'false') {
                    return {
                        message:
                            'Notification state must be a true or false value',
                    }
                }
            } else if (issue.code === z.ZodIssueCode.invalid_type) {
                if (
                    issue.received === 'undefined' ||
                    issue.received === 'null'
                ) {
                    return { message: 'Notification state is required' }
                } else if (issue.received !== 'string') {
                    return {
                        message: 'Notification state must be in string format',
                    }
                }
            }
            return { message: 'Internal server error' }
        },
    }),
    is_completed: z.enum(['true', 'false'], {
        errorMap: (issue, _ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                if (issue.received !== 'true' && issue.received !== 'false') {
                    return {
                        message:
                            'Completion state must be a true or false value',
                    }
                }
            } else if (issue.code === z.ZodIssueCode.invalid_type) {
                if (
                    issue.received === 'null' ||
                    issue.received === 'undefined'
                ) {
                    return { message: 'Completion state is required' }
                } else if (issue.received !== 'string') {
                    return { message: 'Completion state must be a string' }
                }
            }
            return { message: 'Internal server error' }
        },
    }),
    task_priority_id: z.coerce.number(),
})

export const updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user.profile_id
            const task_id = parseInt(req.params.task_id)
            const {
                title,
                description,
                deadline,
                is_notified,
                is_completed,
                task_priority_id,
            } = req.body

            const schemaResult = UpdateTaskSchema.safeParse({
                task_id,
                profile_id,
                title,
                description,
                deadline,
                is_notified,
                is_completed,
                task_priority_id,
            })
            if (!schemaResult.success) {
                throw schemaResult.error
            }

            const converted_task_priority_id = parseInt(task_priority_id)
            let converted_is_notified
            if (is_notified === 'true') {
                converted_is_notified = true
            } else {
                converted_is_notified = false
            }
            let converted_is_completed
            if (is_completed === 'true') {
                converted_is_completed = true
            } else {
                converted_is_completed = false
            }
            const result = await taskModel.updateTask({
                task_id,
                profile_id,
                title,
                description,
                deadline,
                converted_is_completed,
                converted_is_notified,
                converted_task_priority_id,
            })

            res.status(200).json({ result: result })
        } else {
            throw new CustomError(
                401,
                'User is not authorized',
                new Error('User is not authorized')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}

const DeleteTaskSchema = z.object({
    task_id: z.number(),
    profile_id: z.number(),
})

export const deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user.profile_id
            const task_id = parseInt(req.params.task_id)

            const schemaResult = DeleteTaskSchema.safeParse({
                task_id,
                profile_id,
            })
            if (!schemaResult.success) {
                throw schemaResult.error
            }

            await taskModel.deleteTask(task_id, profile_id)

            res.status(200).json({ result: 'Successful deletion of task' })
        } else {
            throw new CustomError(
                401,
                'User is not authorized',
                new Error('User is not authorized')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}
