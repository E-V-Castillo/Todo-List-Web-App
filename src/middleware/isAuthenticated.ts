import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../types/errors/CustomError'

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        // Create an error object to pass to the error handling middleware
        const error = new CustomError(
            401,
            'User is not authenticated',
            new Error(`User is not authenticated`)
        )

        // Pass the error to the error handling middleware
        return next(error)
    }
}
