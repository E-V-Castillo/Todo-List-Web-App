import { Response, Request, ErrorRequestHandler, NextFunction } from 'express'
import { CustomError } from '../types/errors/CustomError'

export const handleServerError = async (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof CustomError) {
        console.log(error.debugError)

        res.status(error.statusCode).json({ error: error.message })
    } else {
        next(error)
    }
}
