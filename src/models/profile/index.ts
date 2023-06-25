import pool from '../../config/database'
import { CustomError } from '../../types/errors/CustomError'
import { ErrorFactory } from '../../utils/ErrorFactory'

const errorFactory = new ErrorFactory()

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
        } catch (err) {
            throw errorFactory.generateError(err)
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
                await client.query('BEGIN')
                const query =
                    'INSERT INTO profile (email, username, password) VALUES ($1, $2, $3) RETURNING email, username'
                const params = [email, username, password]

                try {
                    const result = await client.query(query, params)
                    await client.query('COMMIT')
                    const rows = result.rows
                    return rows[0]
                } catch (err) {
                    throw err
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
        } catch (err) {
            await client?.query('ROLLBACK')
            throw err
        } finally {
            client?.release()
        }
    }
    // Read

    //FIGURE OUT IF THESE ARE USELESS
    async getProfileById(id: number) {
        let client
        try {
            client = await pool.connect()
            const query = `SELECT * from profile WHERE profile_id = $1`
            const values = [id]
            const { rows } = await client.query(query, values)
            const user: UserInterface = rows[0]
            return user
        } catch (err) {
            throw errorFactory.generateError(err)
        } finally {
            client?.release()
        }
    }

    async getProfileByEmail(email: string) {
        let client
        try {
            client = await pool.connect()
            const query = `SELECT * from profile WHERE email = $1`
            const values = [email]
            const { rows } = await client.query(query, values)
            const user: UserInterface = rows[0]
            return user
        } catch (error) {
            throw error
        }
    }
}

export const profileModel = new ProfileModel()
