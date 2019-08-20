import express from 'express'
import { config } from 'dotenv'
import botDataRoute from './botDataRoute'
// import GG from './test/test'

config()
const {
  PORT
} = process.env

const app = express()
app.use(express.json())

// Rutas
app.use('/api/bot', botDataRoute)

app.listen({ port: PORT }, () => console.log(`Example app listening on port ${PORT}!`))
