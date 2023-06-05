import session from 'express-session'
import pgSession from 'connect-pg-simple'
import express from 'express'
import dotenv from 'dotenv'

import passport from 'passport'
import { profileModel } from './models/profile'
import { Strategy as LocalStrategy } from 'passport-local'

import pool from './config/database'

import taskRouter from './routes/tasks/index'
import categoryRouter from './routes/categories/index'
import profileRouter from './routes/profiles/index'
import indexRouter from './routes/index'
import { isAuthenticated } from './middleware/isAuthenticated'

dotenv.config()

const app = express()

const pgSessionStore = new (pgSession(session))({
    pool: pool,
})

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

passport.use(
    new LocalStrategy(async (email, password, done) => {
        const user = await profileModel.getProfileByEmail(email)
        if (!user) {
            console.log('No User found with the email ' + email)
            return done(null, false)
        }
        if (user.password != password) {
            console.log('user found')

            return done(null, false)
        }
        console.log('Authentication successful for user')
        console.log(user)

        return done(null, user)
    })
)

passport.serializeUser((user: any, done) => {
    console.log('Serialize User')
    done(null, user.profile_id)
})

passport.deserializeUser(async (id: string, done) => {
    console.log('Deserialize user')

    const userId = parseInt(id)
    try {
        const result = await profileModel.getProfileById(userId)
        done(null, result)
    } catch (error) {
        done(error)
    }
})

app.use('/tasks', isAuthenticated, taskRouter)
app.use('/categories', isAuthenticated, categoryRouter)
app.use('/profiles', profileRouter)
app.use('/', indexRouter)

const port = 3000
app.listen(port, () => {
    console.log('server started')
})
