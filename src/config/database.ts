import { ClientConfig, Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let dbConfig;
const environment = process.env.ENVIRONMENT;

if (environment === 'development') {
    console.log('SERVER RUNNING IN DEVELOPMENT MODE');

    dbConfig = {
        host: process.env.DEV_DATABASE_HOST,
        database: process.env.DEV_DATABASE_NAME,
        password: process.env.DEV_DATABASE_PASSWORD,
        port: parseInt(process.env.DEV_DATABASE_PORT!),
        user: process.env.DEV_DATABASE_USER,
    };
} else if (environment === 'testing') {
    console.log('SERVER RUNNING IN TESTING MODE');
    dbConfig = {
        host: process.env.TEST_DATABASE_HOST,
        database: process.env.TEST_DATABASE_NAME,
        password: process.env.TEST_DATABASE_PASSWORD,
        port: parseInt(process.env.TEST_DATABASE_PORT!),
        user: process.env.TEST_DATABASE_USER,
    };
}
const pool = new Pool(dbConfig);

export default pool;
