import { NextFunction, Request, Response } from 'express'

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/profiles/login')
    }
}
