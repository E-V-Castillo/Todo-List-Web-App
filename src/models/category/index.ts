import { Client, PoolClient } from 'pg'
import pool from '../../config/database'
import { CustomError } from '../../types/errors/CustomError'

import { ErrorFactory } from '../../utils/ErrorFactory'

const errorFactory = new ErrorFactory()

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
        } catch (err) {
            throw err
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

            if (result.rows[0].count >= 1) {
                return true
            } else {
                return false
            }
        } catch (err) {
            throw err
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
            await client.query('BEGIN')
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
            await client.query('COMMIT')
            return result.rows[0]
        } catch (err) {
            await client?.query('ROLLBACK')
            throw err
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
                'SELECT category.name, category.category_id FROM category INNER JOIN profile ON profile.profile_id = category.profile_id WHERE category.profile_id = $1 ORDER BY category_id'
            const values = [profile_id]
            const { rows } = await client.query(query, values)
            return rows
        } catch (err) {
            throw err
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
            await client.query('BEGIN')

            const existsById = await this.categoryExistsById(
                category_id,
                profile_id,
                client
            )
            const existsByName = await this.categoryExistsByName(
                newName,
                profile_id,
                client
            )

            if (!existsById) {
                throw new CustomError(
                    404,
                    'Resource not found',
                    new Error(
                        'User tried to access a category that did not belong to them or does not exist'
                    )
                )
            }
            if (existsByName) {
                throw new CustomError(
                    400,
                    'That name is already in use',
                    new Error(
                        'User tried to update a category name with a name already used'
                    )
                )
            }
            const query =
                'UPDATE category SET name = $1 WHERE category_id = $2 AND profile_id = $3 RETURNING name, category_id'
            const values = [newName, category_id, profile_id]
            const rows = await client.query(query, values)
            await client.query('COMMIT')
            return rows.rows[0]
        } catch (err) {
            await client?.query('ROLLBACK')
            throw err
        } finally {
            client?.release()
        }
    }

    // Delete
    async deleteCategoryWithId(category_id: number, profile_id: number) {
        let client
        try {
            client = await pool.connect()
            await client.query('BEGIN')
            if (
                await this.categoryExistsById(category_id, profile_id, client)
            ) {
                const query =
                    'DELETE FROM category WHERE category_id = $1 AND profile_id = $2'
                const values = [category_id, profile_id]
                await client.query(query, values)
                await client.query('COMMIT')
            } else {
                throw new CustomError(
                    404,
                    'Resource not found',
                    new Error(
                        'User tried to access a category that did not belong to them or does not exist'
                    )
                )
            }
        } catch (err) {
            await client?.query('ROLLBACK')
            throw err
        } finally {
            client?.release()
        }
    }
}

export const categoryModel = new CategoryModel()
