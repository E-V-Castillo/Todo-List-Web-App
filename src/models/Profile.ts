import { connect } from 'http2'
import pool from '../config/database'
import { QueryResult } from 'pg'

export class Profile {
    async createProfile({ email, username, password }: User) {
        try {
            const client = await pool.connect()
            const sql =
                'INSERT INTO profile (email, username, password) VALUES ($1, $2, $3)'
            const params = [email, username, password]
            await client.query(sql, params)
            client.release()
        } catch (error) {
            console.error('Error while creating a user', error)
        }
    }

    async getProfileById(id: number) {
        const client = await pool.connect()
        const sql = `SELECT * from profile WHERE profile_id = $1`
        const values = [id]
        try {
            const { rows } = await client.query(sql, values)
            const user: User = rows[0]
            return user
        } catch (error) {
            throw error
        } finally {
            client.release()
        }
    }

    async getProfileByName(name: string) {
        const client = await pool.connect()
        const sql = `SELECT * from profile WHERE username = $1`
        const values = [name]
        try {
            const { rows } = await client.query(sql, values)
            const user: User = rows[0]
            return user
        } catch (error) {
            console.error('Error retrieving user', error)
        }
    }

    async getAllProfiles() {
        const client = await pool.connect()
        const sql = 'SELECT * from profile'
        const { rows } = await client.query(sql)
        client.release()
        return rows
    }
}

export const profileModel = new Profile()
