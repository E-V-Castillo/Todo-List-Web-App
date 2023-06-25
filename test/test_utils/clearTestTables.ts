import { PoolClient } from 'pg'
import pool from '../../src/config/database'

export default async function clearTestTables() {
    let client
    try {
        client = await pool.connect()
        const query = `
            TRUNCATE TABLE attachment, category, note, session, task, task_category, task_dependency;
            DELETE FROM profile WHERE profile_id <> 1;`
        await client.query(query)
    } catch (error) {
        throw error
    } finally {
        client?.release()
    }
}
