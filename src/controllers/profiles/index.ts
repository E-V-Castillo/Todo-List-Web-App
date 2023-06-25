import { NextFunction, Request, Response } from 'express'
import { profileModel } from '../../models/profile/index'
import { CustomError } from '../../types/errors/CustomError'
import { ZodError, z } from 'zod'
import { ErrorFactory } from '../../utils/ErrorFactory'
import passport from 'passport'

const errorFactory = new ErrorFactory()

const CreateUserSchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
        .max(254, { message: 'Email must be shorter than 254 characters' })
        .email({ message: 'Email must be a valid email' }),
    username: z
        .string({
            required_error: 'Username is required',
            invalid_type_error: 'Username must be a string',
        })
        .max(100, {
            message: 'Username must be shorter than 100 characters',
        })
        .min(3, { message: 'Username must be longer than 3 characters' }),
    password: z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
        })
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
        const schemaResult = CreateUserSchema.safeParse({
            email,
            username,
            password,
        })
        if (!schemaResult.success) {
            throw schemaResult.error
        }

        const result = await profileModel.createProfile({
            email,
            username,
            password,
        })

        res.status(201).json({ result: result })
    } catch (err) {
        next(errorFactory.generateError(err))
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
            res.status(200).json({ result: user })
        } else {
            throw new CustomError(
                401,
                'User is not logged in',
                new Error('User has not logged in')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}

export const viewProfile = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user !== undefined) {
            console.log('req.user has something')

            const { password, profile_id, ...user } = req.user
            res.status(200).json({ result: user })
        } else {
            throw new CustomError(
                401,
                'User is not logged in',
                new Error('User is not logged in')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}
