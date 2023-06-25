import { NextFunction, Request, Response } from 'express'
import passport, { AuthenticateCallback } from 'passport'
import { ErrorFactory } from '../../../utils/ErrorFactory'
import { CustomError } from '../../../types/errors/CustomError'
import { ZodError } from 'zod'

const errorFactory = new ErrorFactory()

interface AuthenticationParams {
    err: any
    user: Express.User | false | null
    info?: object | string | Array<string | undefined>
    status?: number | Array<number | undefined>
}

export const handleLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate(
        'local',
        (err: any, user: any, info: any, status: any) => {
            try {
                if (err) {
                    // Handle error
                    throw errorFactory.generateError(err) // Call the next middleware with the error
                }

                if (!user) {
                    // Authentication failed
                    throw new CustomError(
                        401,
                        'Invalid credentials',
                        new Error('User inputted bad credentials')
                    )
                } else {
                    // Authentication successful, user object contains authenticated user details
                    req.logIn(user, (err) => {
                        if (err) {
                            // Handle error during login
                            next(
                                new CustomError(
                                    500,
                                    'Internal Server Error',
                                    err
                                )
                            )
                        }
                        next()
                    })
                }
            } catch (error) {
                next(errorFactory.generateError(error))
            }
        }
    )(req, res, next)
}
