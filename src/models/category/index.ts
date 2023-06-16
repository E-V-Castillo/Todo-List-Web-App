import { Client, PoolClient } from 'pg'
import pool from '../../config/database'
import { CustomError } from '../../types/errors/CustomError'
import { doesCategoryExist } from './utils/doesCategoryExist'

class CategoryModel {
    private async categoryExistsById(
        category_id: number,
        profile_id: number,
        client: PoolClient
    ) {
        try {
            const query =
                'SELECT COUNT(*) FROM category WHERE category_id = $1 AND profile_id = $2'
            const values = [category_id, profile_id]
            const result = await client.query(query, values)

            if (result.rows[0].count >= 1) {
                return true
            } else {
                return false
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new CustomError(500, 'Internal Server Error', error)
            }
        }
    }

    private async categoryExistsByName(
        name: string,
        profile_id: number,
        client: PoolClient
    ) {
        try {
            const query =
                'SELECT COUNT(*) FROM category WHERE name = $1 AND profile_id = $2'
            const values = [name, profile_id]
            const result = await client.query(query, values)
            console.log(result.rowCount)
            console.log(result.rows[0].count)

            if (result.rows[0].count >= 1) {
                return true
            } else {
                return false
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new CustomError(500, 'Internal Server Error', error)
            }
        }
    }
    // Create
    async createCategory({
        name,
        profile_id,
    }: {
        name: string
        profile_id: number
    }) {
        let client
        try {
            client = await pool.connect()
            if (await this.categoryExistsByName(name, profile_id, client)) {
                throw new CustomError(
                    400,
                    `Category with name: ${name} already exists`,
                    new Error('Category already exists')
                )
            }
            const query =
                'INSERT INTO category (name, profile_id) VALUES ($1, $2) RETURNING name, category_id'
            const values = [name, profile_id]

            const result = await client.query(query, values)
            const row = result.rows[0]
            return row
        } catch (error) {
            if (error instanceof CustomError) {
                throw error
            } else if (error instanceof Error) {
                throw new CustomError(500, 'Internal Server Error', error)
            }
        } finally {
            client?.release()
        }
    }
    // Read
    async getAllCategories(profile_id: number) {
        let client
        try {
            client = await pool.connect()
            const query =
                'SELECT category.name FROM category INNER JOIN profile ON profile.profile_id = category.profile_id WHERE category.profile_id = $1'
            const values = [profile_id]
            const { rows } = await client.query(query, values)
            return rows
        } catch (error) {
            throw new CustomError(500, 'Internal Server Error', error as Error)
        } finally {
            client?.release()
        }
    }

    //Update
    async updateCategory(
        newName: string,
        category_id: number,
        profile_id: number
    ) {
        let client
        try {
            client = await pool.connect()

            if (
                await this.categoryExistsById(category_id, profile_id, client)
            ) {
                const query =
                    'UPDATE category SET name = $1 WHERE category_id = $2 AND profile_id = $3 RETURNING name, category_id'
                const values = [name, category_id, profile_id]
                const { rows }: { rows: CategoryDto[] } = await client.query(
                    query,
                    values
                )
                return rows
            } else {
                throw new CustomError(
                    403,
                    'Unauthorized Access',
                    new Error(
                        'User tried to access a category that did not belong to them'
                    )
                )
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error
            } else if (error instanceof Error) {
                throw new CustomError(500, 'Internal Server Error', error)
            } else {
                throw new CustomError(
                    500,
                    'Internal Server Error',
                    new Error('Unaccounted Error Occurred')
                )
            }
        } finally {
            client?.release()
        }
    }

    // Delete
    async deleteCategoryWithId(category_id: number, profile_id: number) {
        let client
        try {
            client = await pool.connect()
            if (
                await this.categoryExistsById(category_id, profile_id, client)
            ) {
                const query =
                    'DELETE FROM category WHERE category_id = $1 AND profile_id = $2'
                const values = [category_id, profile_id]
                await client.query(query, values)
            } else {
                throw new CustomError(
                    403,
                    'Unauthorized Access',
                    new Error(
                        'User tried to access a category that did not belong to them'
                    )
                )
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error
            } else if (error instanceof Error) {
                throw new CustomError(500, 'Internal Server Error', error)
            } else {
                throw new CustomError(
                    500,
                    'Internal Server Error',
                    new Error('Unaccounted Error Occurred')
                )
            }
        } finally {
            client?.release()
        }
    }
}

export const categoryModel = new CategoryModel()
