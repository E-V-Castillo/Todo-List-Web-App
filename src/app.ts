import session from 'express-session'
import pgSession from 'connect-pg-simple'
import profileRouter from './routes/profiles/profiles'
import indexRouter from './routes/index'

import express from 'express'
import pool from './config/database'
import passport from 'passport'
import { profileModel } from './models/Profile'
import { Strategy as LocalStrategy } from 'passport-local'

const app = express()

const pgSessionStore = new (pgSession(session))({
    pool: pool,
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    session({
        secret: 'supersecretkey',
        saveUninitialized: true,
        resave: false,
        store: pgSessionStore,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    })
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(
    new LocalStrategy(async (username, password, done) => {
        const user = await profileModel.getProfileByName(username)
        if (!user) {
            console.log('No User found with the name ' + username)
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

app.use('/profiles', profileRouter)
app.use('/', indexRouter)

const port = 3000
app.listen(port, () => {
    console.log('server started')
})
