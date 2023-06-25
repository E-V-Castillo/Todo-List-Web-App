import { ZodError } from 'zod'
import { CustomError } from '../types/errors/CustomError'

export class ErrorFactory {
    generateError(error: unknown) {
        if (error instanceof CustomError) {
            return error
        } else if (error instanceof ZodError) {
            return error
        } else if (error instanceof Error) {
            return new CustomError(500, 'Internal Server Error', error)
        } else {
            return new CustomError(
                500,
                'Internal Server Error',
                new Error('Unaccounted error occurred')
            )
        }
    }
}
