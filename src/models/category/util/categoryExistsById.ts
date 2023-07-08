import { PoolClient } from 'pg'

export default async function categoryExistsById(
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
