import { Request, Response } from 'express'
import { profileModel } from '../../models/Profile'

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
        console.log(error)
    }
}

export const createUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body
    await profileModel.createProfile({ email, username, password })
    res.send('User Created')
}

export const userLogin = async (req: Request, res: Response) => {
    res.send('hello login')
}
