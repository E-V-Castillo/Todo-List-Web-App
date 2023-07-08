import { PoolClient } from 'pg'

export default async function categoryExistsByName(
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
