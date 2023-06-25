import pool from '../../config/database'
import { CustomError } from '../../types/errors/CustomError'
import { TaskFilter } from '../../types/task.interface'
import { doesTaskExist } from './utils/doesTaskExist'

import { ErrorFactory } from '../../utils/ErrorFactory'

const errorFactory = new ErrorFactory()

export class TaskModel {
    // Create
    async createTask({
        title,
        description,
        deadline,
        converted_is_notified,
        profile_id,
        converted_task_priority_id,
    }: TaskDto) {
        let client
        try {
            client = await pool.connect()
            await client.query('BEGIN')
            const query = `
            INSERT INTO task (
                title, description, deadline, is_notified, profile_id, task_priority_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            )RETURNING task_id
            `
            const values = [
                title,
                description,
                deadline,
                converted_is_notified,
                profile_id,
                converted_task_priority_id,
            ]
            const result = await client.query(query, values)
            const task_id = result.rows[0].task_id
            const selectQuery = `
            SELECT
                task.task_id,
                task.title,
                task.description, 
                task.deadline,
                task.is_completed,
                task.is_notified, 
                task.created_at,
                task.task_priority_id,
                task_priority.priority
            FROM task
            JOIN task_priority ON task.task_priority_id = task_priority.task_priority_id
            WHERE task.task_id = $1 AND task.profile_id = $2`
            const selectValues = [task_id, profile_id]
            const selectResult = await client.query(selectQuery, selectValues)
            console.log(selectResult.rows[0])
            await client.query('COMMIT')
            return selectResult.rows[0]
        } catch (err) {
            await client?.query('ROLLBACK')
            throw err
        } finally {
            client?.release()
        }
    }
    // Read

    async readTaskWithFilter(
        profile_id: number,
        {
            completedQuery,
            priorityQuery,
            titleQuery,
            endDateQuery,
            startDateQuery,
        }: TaskFilter
    ) {
        let client
        try {
            client = await pool.connect()

            const query = `
            SELECT 
            task.task_id,
            task.title,
            task.description, 
            task.deadline, 
            task.is_completed,
            task.is_notified,
            task.created_at,
            task.task_priority_id,
            task_priority.priority,
            completed_at
            FROM task 
            INNER JOIN task_priority ON task.task_priority_id = task_priority.task_priority_id
            WHERE profile_id = $1 
            AND ($2::boolean IS NULL OR is_completed = $2)
            AND ($3::varchar(20) IS NULL OR task_priority.priority = $3)
            AND ($4::varchar(300) IS NULL OR title ILIKE '%' || $4 || '%')
            AND (($5::timestamp IS NULL OR $6::timestamp IS NULL) 
                OR  deadline BETWEEN $5 AND $6 )`
            const values = [
                profile_id,
                completedQuery,
                priorityQuery,
                titleQuery,
                startDateQuery,
                endDateQuery,
            ]

            const result = await client.query(query, values)

            return result.rows
        } catch (err) {
            throw err
        } finally {
            client?.release()
        }
    }
    //FIX THIS TOMORROW

    async updateTask({
        task_id,
        profile_id,
        title,
        description,
        deadline,
        converted_is_completed,
        converted_is_notified,
        converted_task_priority_id,
    }: {
        task_id: number
        title: string
        description: string | null
        deadline: Date
        converted_is_completed: boolean
        converted_is_notified: boolean
        profile_id: number
        converted_task_priority_id: number
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
                    task_id = $7
                    AND profile_id = $8
                `
                const values = [
                    title,
                    description,
                    deadline,
                    converted_is_completed,
                    converted_is_notified,
                    converted_task_priority_id,
                    task_id,
                    profile_id,
                ]
                const result = await client.query(query, values)

                const selectQuery = `
                SELECT
                    task.task_id,
                    task.title,
                    task.description,
                    task.deadline,
                    task.is_completed,
                    task.is_notified,
                    task.created_at,
                    task.task_priority_id,
                    task_priority.priority
                FROM task
                INNER JOIN task_priority ON task.task_priority_id = task_priority.task_priority_id
                WHERE task.task_id = $1 AND task.profile_id = $2
                 `
                const selectValues = [task_id, profile_id]
                const selectResult = await client.query(
                    selectQuery,
                    selectValues
                )
                await client.query('COMMIT')
                return selectResult.rows[0]
            } else {
                throw new CustomError(
                    404,
                    'Resource not found',
                    new Error(
                        'User tried to update a task that did not exist or did not belong to them'
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
                throw new CustomError(
                    404,
                    'Resource not found',
                    new Error(
                        'User tried to delete a task that did not exist or did not belong to them'
                    )
                )
            }
        } catch (err) {
            await client?.query('ROLLBACK') // Rollback the transaction if an error occurs
            throw err
        } finally {
            client?.release()
        }
    }
}

const taskModel = new TaskModel()

export default taskModel
