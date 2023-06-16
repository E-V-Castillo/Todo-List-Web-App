import { NextFunction, Request, Response } from 'express'
import { categoryModel } from '../../models/category/index'
import { CustomError } from '../../types/errors/CustomError'
import { ZodError, z } from 'zod'
import { fromZodError, isValidationErrorLike } from 'zod-validation-error'

const CreateCategorySchema = z.object({
    name: z
        .string({
            required_error: 'Name of category is needed to create a category',
            invalid_type_error: 'Name must be a string',
        })
        .max(64, { message: 'Name must be below 64 characters' })
        .min(1, { message: 'Name must not be empty' }),
})

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

const DeleteCategorySchema = z.object({
    category_id: z
        .number({
            required_error: 'Category ID must be provided in the parameters',
            invalid_type_error: 'Category ID must be a number',
        })
        .min(1, { message: '0 is not a valid Category ID' }),
})

type CreateCategoryType = z.infer<typeof CreateCategorySchema>
type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const category: CreateCategoryType = req.body
        CreateCategorySchema.parse(category)
        const name = category.name

        if (req.user?.profile_id != undefined) {
            const profile_id = req.user!.profile_id
            await categoryModel.createCategory({ name, profile_id })
            console.log(
                `Category created with name ${name} and id of ${profile_id}`
            )
            return res.status(201).json({ Success: 'Category created' })
        } else {
            throw new CustomError(
                401,
                'You need to login before accessing this resource',
                new Error('User is not logged in')
            )
        }
    } catch (error) {
        if (error instanceof ZodError) {
            next(error)
        } else if (error instanceof CustomError) {
            next(error)
        } else {
            console.log(error)
            next(
                new CustomError(
                    400,
                    'Bad User Input',
                    new Error('User inputted bad values for "name"')
                )
            )
        }
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
            const results = await categoryModel.getAllCategories(profile_id)
            res.status(200).json({ results })
        } else {
            throw new CustomError(
                401,
                'You need to login before accessing this resource',
                new Error('User is not logged in')
            )
        }
    } catch (error) {
        if (error instanceof CustomError) {
            next(error)
        } else if (error instanceof Error) {
            throw new CustomError(500, 'Internal Server Error', error)
        }
    }
}

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

            UpdateCategorySchema.parse({ category_id, newName })

            const result = await categoryModel.updateCategory(
                newName,
                category_id,
                profile_id
            )
            res.status(200).json({ result })
        } else {
            throw new CustomError(
                401,
                'You need to login before accessing this resource',
                new Error('User is not logged in')
            )
        }
    } catch (error) {
        if (error instanceof ZodError) {
            next(error)
        } else if (error instanceof CustomError) {
            next(error)
        } else if (error instanceof Error) {
            next(new CustomError(500, 'Internal Server Error', error))
        } else {
            next(
                new CustomError(
                    500,
                    'Internal Server Error',
                    new Error('Unaccounted Error Occurred')
                )
            )
        }
    }
}

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
            DeleteCategorySchema.parse({ category_id })

            await categoryModel.deleteCategoryWithId(category_id, profile_id)
            res.status(200).send('Deletion successful')
        } else {
            throw new CustomError(
                401,
                'You need to login before accessing this resource',
                new Error('User is not logged in')
            )
        }
    } catch (error) {
        if (error instanceof ZodError) {
            next(error)
        } else if (error instanceof CustomError) {
            next(error)
        } else if (error instanceof Error) {
            next(new CustomError(500, 'Internal Server Error', error))
        } else {
            next(
                new CustomError(
                    500,
                    'Internal Server Error',
                    new Error('Unaccounted Error Occurred')
                )
            )
        }
    }
}
