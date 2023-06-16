import pool from '../../config/database'
import { CustomError } from '../../types/errors/CustomError'

class ProfileModel {
    // Return a boolean depending on if a user already exists
    private async userExists(email: string) {
        let client
        try {
            client = await pool.connect()
            const query = `SELECT COUNT(*) FROM profile WHERE email = $1`
            const values = [email]
            const result = await client.query(query, values)
            if (result.rows[0].count >= 1) {
                return true
            } else {
                return false
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new CustomError(500, 'Internal Server Error', error)
            }
        } finally {
            client?.release()
        }
    }

    // Create
    async createProfile({ email, username, password }: UserInterface) {
        let client
        try {
            // Check if user already exists in the database
            if ((await this.userExists(email)) === false) {
                client = await pool.connect()
                const query =
                    'INSERT INTO profile (email, username, password) VALUES ($1, $2, $3) RETURNING email, username'
                const params = [email, username, password]

                try {
                    const result = await client.query(query, params)
                    const rows = result.rows
                    return rows
                } catch (error) {
                    if (error instanceof CustomError) {
                        throw error
                    } else if (error instanceof Error) {
                        console.log('here')

                        throw new CustomError(400, 'Invalid Values', error)
                    }
                }
            } else {
                throw new CustomError(
                    409,
                    'User with that email already exists',
                    new Error(
                        `User entered an invalid email {${email}} but it already has an account in the database`
                    )
                )
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error
            } else if (error instanceof Error) {
                throw new CustomError(500, 'Internal Server Error', error)
            }
        } finally {
            client?.release()
        }
    }
    // Read
    async getProfileById(id: number) {
        const client = await pool.connect()
        const query = `SELECT * from profile WHERE profile_id = $1`
        const values = [id]
        try {
            const { rows } = await client.query(query, values)
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
        const query = `SELECT * from profile WHERE email = $1`
        const values = [email]
        try {
            const { rows } = await client.query(query, values)
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
            const query = 'SELECT * from profile'
            const { rows } = await client.query(query)
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
