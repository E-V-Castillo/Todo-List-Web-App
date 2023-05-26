import profileRouter from './routes/profiles/profiles'
import express from 'express'

const app = express()

const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/profiles', profileRouter)

app.listen(port, () => {
    console.log('server started')
})
