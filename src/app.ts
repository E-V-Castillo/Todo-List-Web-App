import session from 'express-session'
import pgSession from 'connect-pg-simple'
import express from 'express'
import dotenv from 'dotenv'
import cors, { CorsOptions } from 'cors'

import passport from 'passport'
import { profileModel } from './models/profile'
import { Strategy as LocalStrategy } from 'passport-local'

import pool from './config/database'

import taskRouter from './routes/tasks/index'
import categoryRouter from './routes/categories/index'
import profileRouter from './routes/profiles/index'
import indexRouter from './routes/index'
import { isAuthenticated } from './middleware/isAuthenticated'
import { handleRuntimeError } from './middleware/handleRuntimeError'
import { handleServerError } from './middleware/handleServerError'
import { PassportSchema } from './utils/passportZod'

dotenv.config()

export const app = express()

const pgSessionStore = new (pgSession(session))({
    pool: pool,
})

const corsOptions: CorsOptions = {
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        saveUninitialized: false,
        resave: false,
        store: pgSessionStore,
        cookie: { maxAge: 1000 * 60 * 60 },
    })
)

app.use(passport.initialize())
app.use(passport.session())

// I hate passport
passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const schemaResult = PassportSchema.safeParse({
                    email,
                    password,
                })
                if (!schemaResult.success) {
                    throw schemaResult.error
                }
                const user = await profileModel.getProfileByEmail(email)
                if (!user) {
                    return done(null, false, {
                        message: 'Failed to find user with email',
                    })
                }
                if (user.password != password) {
                    return done(null, false, { message: 'Invalid password' })
                }
                console.log('Authentication successful for user')
                console.log(user)

                return done(null, user)
            } catch (error) {
                return done(error, false, {
                    message: 'Internal Server Message',
                })
            }
        }
    )
)

passport.serializeUser((user: any, done) => {
    done(null, user.profile_id)
})

passport.deserializeUser(async (id: string, done) => {
    const userId = parseInt(id)
    try {
        const result = await profileModel.getProfileById(userId)
        done(null, result)
    } catch (error) {
        done(error, false)
    }
})

app.use('/tasks', isAuthenticated, taskRouter)
app.use('/categories', isAuthenticated, categoryRouter)
app.use('/profiles', profileRouter)
app.use('/', indexRouter)
app.use(handleRuntimeError)
app.use(handleServerError)

const port = 3000
if (process.env.ENVIRONMENT !== 'testing') {
    app.listen(port, () => {
        console.log('server started')
    })
}
