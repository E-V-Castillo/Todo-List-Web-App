import { NextFunction, Request, Response } from 'express'
import { profileModel } from '../../models/profile/index'
import { CustomError } from '../../types/errors/CustomError'

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

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await profileModel.getAllProfiles()
        res.status(200).json(users)
    } catch (error) {
        console.error('Error in finding all users in database', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const getProtectedProfile = async (req: Request, res: Response) => {
    console.log('in my controller')
    try {
        const { stringId } = req.params
        const id = parseInt(stringId)
        const user = await profileModel.getProfileById(id)
        res.status(200).json(user)
    } catch (error) {
        console.error('Error in getProtectedProfile function', error)
        res.status(401).send('Not logged in')
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
