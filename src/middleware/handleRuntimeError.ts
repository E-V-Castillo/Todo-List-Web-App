import { Response, Request, ErrorRequestHandler, NextFunction } from 'express'
import { ZodError } from 'zod'

import { ValidationError, isValidationErrorLike } from 'zod-validation-error'

export const handleRuntimeError = async (
    error: ValidationError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        const message: string[] = []
        error.errors.forEach((errorMessage) => {
            message.push(errorMessage.message)
        })
        console.log(message)

        res.status(400).json({ Error: message })
    } else {
        next(error)
    }
}
