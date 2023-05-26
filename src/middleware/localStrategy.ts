import passport, { DoneCallback } from 'passport'
import { Strategy as LocalStrategy, IVerifyOptions } from 'passport-local'
import pool from '../config/database'
import { PoolClient } from 'pg'

passport.use(
    new LocalStrategy(function (
        username: string,
        password: string,
        done: (
            error: any,
            user?: Express.User | false,
            options?: IVerifyOptions
        ) => void
    ): void {
        pool.connect((err: Error, client: PoolClient, release: () => void) => {
            if (err) {
                return console.error(
                    'Error acquiring available client from pool',
                    err.stack
                )
            }
            client.query('SELECT * FROM profile')
        })
    })
)
