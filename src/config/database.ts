import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USER,
} = process.env

const pool = new Pool({
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    password: DATABASE_PASSWORD,
    port: parseInt(DATABASE_PORT!),
    user: DATABASE_USER,
})

export default pool
