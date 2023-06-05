import pool from '../../config/database'

class ProfileModel {
    // Create
    async createProfile({ email, username, password }: UserInterface) {
        try {
            const client = await pool.connect()
            const sql =
                'INSERT INTO profile (email, username, password) VALUES ($1, $2, $3)'
            const params = [email, username, password]

            await client.query(sql, params)

            client.release()
        } catch (error) {
            throw error
        }
    }
    // Read
    async getProfileById(id: number) {
        const client = await pool.connect()
        const sql = `SELECT * from profile WHERE profile_id = $1`
        const values = [id]
        try {
            const { rows } = await client.query(sql, values)
            const user: UserInterface = rows[0]
            return user
        } catch (error) {
            throw error
        } finally {
            client.release()
        }
    }

    async getProfileByEmail(email: string) {
        const client = await pool.connect()
        const sql = `SELECT * from profile WHERE email = $1`
        const values = [email]
        try {
            const { rows } = await client.query(sql, values)
            const user: UserInterface = rows[0]
            return user
        } catch (error) {
            throw error
        }
    }

    async getAllProfiles() {
        let client
        try {
            client = await pool.connect()
            const sql = 'SELECT * from profile'
            const { rows } = await client.query(sql)
            return rows
        } catch (error) {
            throw error
        } finally {
            if (client) {
                client.release()
            }
        }
    }
}

export const profileModel = new ProfileModel()
