import { PoolClient } from 'pg'

export const doesTaskExist = async (
    task_id: number,
    profile_id: number,
    client: PoolClient
) => {
    try {
        const query =
            'SELECT title FROM task WHERE task_id = $1 AND profile_id = $2 LIMIT 1'
        const values = [task_id, profile_id]
        const result = await client.query(query, values)
        if (result.rowCount > 0) {
            console.log('Will return true')
        } else {
            console.log('Will return false')
        }
        return result.rowCount > 0
    } catch (error) {
        console.error(
            `Error finding if category id of ${task_id} exists with a profile id of ${profile_id}`,
            error
        )
        throw error
    }
}
