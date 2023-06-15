import { Response, Request, ErrorRequestHandler, NextFunction } from 'express'
import { CustomError } from '../types/errors/CustomError'

export const handleError = async (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(error.debugError)
    res.status(error.statusCode).json({ Error: error.message })
}
