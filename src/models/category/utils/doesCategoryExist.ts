import { PoolClient } from 'pg'

export const doesCategoryExist = async (
    category_id: number,
    profile_id: number,
    client: PoolClient
) => {
    try {
        const checkQuery =
            'SELECT name FROM category WHERE category_id = $1 AND profile_id = $2 LIMIT 1'
        const checkValues = [category_id, profile_id]
        const checkResult = await client.query(checkQuery, checkValues)

        if (checkResult.rowCount > 0) {
            console.log('Will return true')
        } else {
            console.log('Will return false')
        }

        return checkResult.rowCount > 0
    } catch (error) {
        console.error(
            `Error checking if category id of ${category_id} exists with a profile id of ${profile_id}`,
            error
        )
        throw error
    }
}
