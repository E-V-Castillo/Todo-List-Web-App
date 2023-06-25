import { Response, Request, ErrorRequestHandler, NextFunction } from 'express'
import { ZodError } from 'zod'

export const handleRuntimeError = async (
    error: ZodError,
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
        console.log(error)

        res.status(400).json({ error: message })
    } else {
        next(error)
    }
}
