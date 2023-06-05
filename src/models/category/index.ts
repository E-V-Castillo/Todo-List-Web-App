import pool from '../../config/database'
import { doesCategoryExist } from './utils/doesCategoryExist'

class CategoryModel {
    // Create
    async createCategory({ name, profile_id }: CategoryInterface) {
        let client
        try {
            client = await pool.connect()
            const query =
                'INSERT INTO category (name, profile_id) VALUES ($1, $2) RETURNING name, category_id'
            const values = [name, profile_id]

            await client.query(query, values)
        } catch (error) {
            console.error('Error in creating a category', error)
            throw error
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
            console.error('Error in creating a category', error)
            throw error
        } finally {
            client?.release()
        }
    }

    //Update
    async updateCategory(
        name: string,
        category_id: number,
        profile_id: number
    ) {
        let client
        try {
            client = await pool.connect()

            if (await doesCategoryExist(category_id, profile_id, client)) {
                const query =
                    'UPDATE category SET name = $1 WHERE category_id = $2 AND profile_id = $3 RETURNING name, category_id'
                const values = [name, category_id, profile_id]
                const { rows }: { rows: CategoryDto[] } = await client.query(
                    query,
                    values
                )
                return rows
            } else {
                throw new Error('Category does not exist for that user')
            }
        } catch (error) {
            console.error('Error in updating a category', error)
            throw error
        } finally {
            client?.release()
        }
    }

    // Delete
    async deleteCategoryWithId(category_id: number, profile_id: number) {
        let client
        try {
            client = await pool.connect()
            if (await doesCategoryExist(category_id, profile_id, client)) {
                const query =
                    'DELETE FROM category WHERE category_id = $1 AND profile_id = $2'
                const values = [category_id, profile_id]
                await client.query(query, values)
            } else {
                throw new Error('Category does not exist for that user')
            }
        } catch (error) {
            console.error('Error in deleting a category', error)
            throw error
        } finally {
            client?.release()
        }
    }
}

export const categoryModel = new CategoryModel()
