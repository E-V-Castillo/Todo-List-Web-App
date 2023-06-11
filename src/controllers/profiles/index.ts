import { Request, Response } from 'express'
import { profileModel } from '../../models/profile/index'

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body
        await profileModel.createProfile({ email, username, password })
        res.status(201).send('User Created')
    } catch (error) {
        console.error('Error in createUser', error)
        res.status(409).send('User account already exists. ')
    }
}

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
        console.error('Error in getProtectedProfile function', error)
        res.status(401).send('Not logged in')
    }
}

export const userLogin = async (req: Request, res: Response) => {
    if (req.user) {
        const { password, profile_id, ...user } = req.user
        res.status(200).json(user)
    } else {
        res.status(401).json({ Error: 'User is not logged in' })
    }
}

export const viewProfile = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.send(req.user)
    } else {
        res.send('Not authenticated')
        res.end
    }
}
