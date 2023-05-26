import { Pool } from 'pg'

const pool = new Pool({
    host: 'localhost',
    database: 'todo_list_project_database',
    password: 'Applemansanas1!',
    port: 5432,
    user: 'postgres',
})

export default pool
