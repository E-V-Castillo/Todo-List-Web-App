import pool from './database'

module.exports = async function (
    globalConfig: any,
    projectConfig: any,
    done: any
) {
    const environment = process.env.ENVIRONMENT
    if (environment === 'testing') {
        let client
        try {
            client = await pool.connect()
            const query = `
                TRUNCATE TABLE attachment, category, note, session, task, task_category, task_dependency;
                DELETE FROM profile WHERE profile_id <> 1;
            `
            await client.query(query)
            return
        } catch (error) {
            console.log(error)
        } finally {
            client?.release()
            return
        }
    } else {
        return
    }
}
