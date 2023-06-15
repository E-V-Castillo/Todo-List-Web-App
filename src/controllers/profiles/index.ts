import { NextFunction, Request, Response } from 'express'
import { profileModel } from '../../models/profile/index'
import { CustomError } from '../../types/errors/CustomError'
import { z } from 'zod'

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, username, password } = req.body
        const result = await profileModel.createProfile({
            email,
            username,
            password,
        })
        res.status(201).json(result![0])
    } catch (error) {
        if (error instanceof CustomError) {
            next(error)
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
    if (req.user) {
        const { password, profile_id, ...user } = req.user
        res.status(200).json(user)
    } else {
        next(
            new CustomError(
                401,
                'User is not logged in',
                new Error('User has not logged in')
            )
        )
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
