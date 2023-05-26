import { Request, Response } from 'express'

export const createUser = (req: Request, res: Response) => {
    const { email, username, password } = req.body
    res.send({ email, username, password })
}

export const getUsers = (req: Request, res: Response) => {
    res.send('hello world')
}
