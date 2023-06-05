import { Request, Response } from 'express'
import { categoryModel } from '../../models/category/index'

export const createCategory = async (req: Request, res: Response) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const { name } = req.body
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' })
        }

        if (req.user!.profile_id != undefined) {
            const profile_id = req.user!.profile_id
            await categoryModel.createCategory({ name, profile_id })
            console.log(
                `Category created with name ${name} and id of ${profile_id}`
            )
            return res.status(201).send('Category created')
        }
    } catch (error) {
        console.error('Error in controller of createCategory', error)
        res.status(500).json({ Error: 'Server Error' })
    }
}

export const readAllCategories = async (req: Request, res: Response) => {
    // Return all categories that belong to this user

    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user?.profile_id
            const results = await categoryModel.getAllCategories(profile_id)
            res.status(200).json({ results })
        } else {
            res.status(401).json({ Error: 'You are not logged in' })
        }
    } catch (error) {
        console.error('Error in controller of readAllCategories', error)
        res.status(500).json({ Error: 'Server Error' })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user?.profile_id
            const category_id = parseInt(req.params.category_id)
            const { newName } = req.body
            const result = await categoryModel.updateCategory(
                newName,
                category_id,
                profile_id
            )
            res.status(200).json({ result })
        }
    } catch (error) {
        console.error('Error in controller of updateCategory', error)
        res.status(500).json({ Error: 'Server Error' })
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    // Parse the id from the params and put into my deleteCategoryWithId function
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user.profile_id
            const category_id = parseInt(req.params.category_id)

            await categoryModel.deleteCategoryWithId(category_id, profile_id)
            res.status(200).send('Deletion successful')
        } else {
            res.status(401).json({ Error: 'You are not logged in' })
        }
    } catch (error) {
        console.error('Error in controller of deleteCategory', error)
        res.status(500).json({ Error: 'Server Error' })
    }
}
