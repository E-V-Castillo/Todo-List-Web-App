"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: 'localhost',
    database: 'todo_list_project_database',
    password: 'Applemansanas1!',
    port: 5432,
    user: 'postgres',
});
