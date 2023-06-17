import { NextFunction, Request, Response } from 'express'
import { profileModel } from '../../models/profile/index'
import { CustomError } from '../../types/errors/CustomError'
import { ZodError, z } from 'zod'

const CreateUserSchema = z.object({
    email: z
        .string()
        .email({ message: 'Email must be a valid email' })
        .max(320, { message: 'Email must be shorter than 320 characters' }),
    username: z
        .string()
        .max(100, {
            message: 'Username must be shorter than 100 characters',
        })
        .min(3, { message: 'Username must be longer than 3 characters' }),
    password: z
        .string()
        .max(40, { message: 'Password must be shorter than 40 characters' })
        .min(8, { message: 'Password must be longer than 8 characters' }),
})

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, username, password } = req.body
        // Zod validation
        CreateUserSchema.parse({ email, username, password })

        const result = await profileModel.createProfile({
            email,
            username,
            password,
        })
        res.status(201).json(result)
    } catch (error) {
        if (error instanceof ZodError) {
            next(error)
        } else if (error instanceof CustomError) {
            next(error)
        } else if (error instanceof Error) {
            next(new CustomError(500, 'Internal Server Error', error))
        } else {
            next(
                new CustomError(
                    500,
                    'Internal Server Error',
                    new Error(`Issue executing createProfile`)
                )
            )
        }
    }
}

export const userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user) {
            const { password, profile_id, ...user } = req.user
            res.status(200).json(user)
        } else {
            throw new CustomError(
                401,
                'User is not logged in',
                new Error('User has not logged in')
            )
        }
    } catch (error) {
        next(error)
    }
}

export const viewProfile = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user !== undefined) {
            const { password, profile_id, ...user } = req.user
            res.status(200).json(user)
        } else {
            throw new CustomError(
                401,
                'User is not logged in',
                new Error('User is not logged in')
            )
        }
    } catch (error) {
        next(error)
    }
}
