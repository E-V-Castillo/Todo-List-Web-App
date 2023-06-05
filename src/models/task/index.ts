import pool from '../../config/database'
import { doesTaskExist } from './utils/doesTaskExist'

export class TaskModel {
    // Create
    async createTask({
        title,
        description,
        deadline,
        is_completed,
        is_notified,
        profile_id,
        task_priority_id,
    }: TaskDto) {
        let client
        try {
            client = await pool.connect()
            const query = `INSERT INTO task (
                title, description, deadline, is_completed, is_notified, profile_id, task_priority_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            ) RETURNING 
                task_id, title, description, deadline,
                is_completed, is_notified, created_at,
                task_priority_id 
            `
            const values = [
                title,
                description,
                deadline,
                is_completed,
                is_notified,
                profile_id,
                task_priority_id,
            ]
            const result = await client.query(query, values)
            return result.rows
        } catch (error) {
            console.error('Error while using createTask', error)
            throw error
        } finally {
            client?.release()
        }
    }
    // Read

    async readAllTasksFromUser(profile_id: number) {
        let client
        try {
            client = await pool.connect()
            const query = `SELECT task_id, title, description, deadline, is_completed, is_notified, created_at,task_priority_id, completed_at FROM task WHERE profile_id = $1`
            const values = [profile_id]
            const result = await client.query(query, values)

            return result.rows
        } catch (error) {
            console.error('Error while using readAllTaskFromUser', error)
            throw error
        } finally {
            client?.release()
        }
    }

    async updateTask({
        task_id,
        title,
        description,
        deadline,
        is_completed,
        is_notified,
        profile_id,
        task_priority_id,
    }: {
        task_id: number
        title: string
        description: string
        deadline: Date
        is_completed: boolean
        is_notified: boolean
        profile_id: number
        task_priority_id: number
    }) {
        let client
        try {
            client = await pool.connect()
            await client.query('BEGIN')

            if (await doesTaskExist(task_id, profile_id, client)) {
                const query = `
                UPDATE task
                    SET 
                    title = $1,
                    description = $2,
                    deadline = $3,
                    is_completed = $4,
                    is_notified = $5,
                    task_priority_id = $6,

                    completed_at = CASE
                        WHEN $4 = true THEN NOW()
                        ELSE NULL
                    END
                    WHERE
                    task_id = $7 AND
                    profile_id = $8

                    RETURNING
                    *
                `
                const values = [
                    title,
                    description,
                    deadline,
                    is_completed,
                    is_notified,
                    task_priority_id,
                    task_id,
                    profile_id,
                ]
                const result = await client.query(query, values)
                await client.query('COMMIT')
                return result.rows
            } else {
                throw new Error('Task does not exist for that user')
            }
        } catch (error) {
            console.error('Error while using readAllTaskFromUser', error)
            throw error
        } finally {
            client?.release()
        }
    }

    async deleteTask(task_id: number, profile_id: number) {
        let client
        try {
            client = await pool.connect()
            await client.query('BEGIN') // Start the transaction

            // Check if the task does exist for that user
            if (await doesTaskExist(task_id, profile_id, client)) {
                const query =
                    'DELETE FROM task WHERE task_id = $1 AND profile_id = $2'
                const values = [task_id, profile_id]
                await client.query(query, values)

                await client.query('COMMIT') // Commit the transaction if all queries succeed
            } else {
                throw new Error('Task does not exist for that user')
            }
        } catch (error) {
            await client?.query('ROLLBACK') // Rollback the transaction if an error occurs
            console.error('Error while using deleteTask', error)
            throw error
        } finally {
            client?.release()
        }
    }
}

const taskModel = new TaskModel()

export default taskModel
