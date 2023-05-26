import { Pool } from 'pg'
export class Database {
    private readonly pool: Pool

    constructor() {
        this.pool = new Pool({
            user: 'postgres',
            password: 'Applemansanas1!',
            host: 'localhost',
            port: 5432,
            database: 'todo_list_project_database',
        })
        this.pool
            .connect()
            .then(() => console.log('connected'))
            .catch((err) => console.error('connection error', err.stack))
    }

    query(sql: string, params: any[] = []): Promise<any> {
        return this.pool.query(sql, params)
    }
}
