const express = require('express')
const app = express()
const router = express.Router()

const port = 3000

app.get('/', (req: any, res: any) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log('server started')
})
