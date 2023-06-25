import { NextFunction, Request, Response } from 'express'
import { categoryModel } from '../../models/category/index'
import { CustomError } from '../../types/errors/CustomError'
import { ZodError, z } from 'zod'
import { ErrorFactory } from '../../utils/ErrorFactory'

const errorFactory = new ErrorFactory()

const CreateCategorySchema = z
    .object({
        name: z
            .string({
                required_error: 'Name of category is required',
                invalid_type_error: 'Name must be a string',
            })
            .max(64, { message: 'Name must be below 64 characters' })
            .min(1, { message: 'Name must not be empty' }),
    })
    .strict()

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = req.body

        // Use zod parse to validate input
        const schemaResult = CreateCategorySchema.safeParse(body)
        if (!schemaResult.success) {
            throw schemaResult.error
        }
        const name = body.name

        if (req.user?.profile_id != undefined) {
            const profile_id = req.user!.profile_id
            const result = await categoryModel.createCategory({
                name,
                profile_id,
            })

            res.status(201).json({ result: result })
        } else {
            throw new CustomError(
                401,
                'User is not logged in',
                new Error('User is not logged in')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}

export const readAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Return all categories that belong to this user

    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user?.profile_id
            const result = await categoryModel.getAllCategories(profile_id)
            res.status(200).json({ result: result })
        } else {
            throw new CustomError(
                401,
                'You need to login before accessing this resource',
                new Error('User is not logged in')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}

const UpdateCategorySchema = z.object({
    category_id: z
        .number({
            required_error: 'Category ID must be provided in the parameters',
            invalid_type_error: 'Category ID must be a number',
        })
        .min(1, { message: '0 is not a valid Category ID' }),
    newName: z
        .string({
            required_error: 'Name of category is needed to create a category',
            invalid_type_error: 'Name must be a string',
        })
        .max(64, { message: 'Name must be below 64 characters' })
        .min(1, { message: 'Name must not be empty' }),
})

export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user?.profile_id
            const category_id = parseInt(req.params.category_id)
            const { newName } = req.body
            // Use zod parse to validate input
            const schemaResult = UpdateCategorySchema.safeParse({
                category_id,
                newName,
            })
            if (!schemaResult.success) {
                throw schemaResult.error
            }

            const result = await categoryModel.updateCategory(
                newName,
                category_id,
                profile_id
            )
            res.status(200).json({ result: result })
        } else {
            throw new CustomError(
                401,
                'User is not logged in',
                new Error('User is not logged in')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}

const DeleteCategorySchema = z.object({
    category_id: z
        .number({
            required_error: 'Category ID must be provided in the parameters',
            invalid_type_error: 'Category ID must be a number',
        })
        .min(1, { message: '0 is not a valid Category ID' }),
})

export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Parse the id from the params and put into my deleteCategoryWithId function
    try {
        if (req.user?.profile_id != undefined) {
            const profile_id = req.user.profile_id
            const category_id = parseInt(req.params.category_id)
            // Use zod parse to validate input
            const schemaResult = DeleteCategorySchema.safeParse({ category_id })
            if (!schemaResult.success) {
                throw schemaResult.error
            }

            await categoryModel.deleteCategoryWithId(category_id, profile_id)
            res.status(200).json({ result: 'Deletion successful' })
        } else {
            throw new CustomError(
                401,
                'You need to login before accessing this resource',
                new Error('User is not logged in')
            )
        }
    } catch (err) {
        next(errorFactory.generateError(err))
    }
}
