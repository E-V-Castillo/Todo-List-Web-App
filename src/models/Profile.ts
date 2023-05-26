import pool from '../config/database'

export class Profile {
    async createProfile({
        email,
        username,
        password,
    }: {
        email: string
        username: string
        password: string
    }) {
        try {
            const client = await pool.connect()
            const query =
                'INSERT INTO profile (email, username, password) VALUES ($1, $2, $3)'
            const params = [email, username, password]
            await client.query(query, params)
            client.release()
        } catch (error) {
            console.error('Error while creating a user', error)
        }
    }
}
