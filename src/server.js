import '@babel/polyfill'
import express from 'express'
import { config } from 'dotenv'
import botDataRoute from './botDataRoute'
// Cron
import cron from 'node-cron'

import { dailyReportEmail } from './utils'

config()
const {
  PORT
} = process.env

const app = express()
app.use(express.json())

cron.schedule('01 22 * * *', async () => {
  try {
    await dailyReportEmail()
  } catch (error) {
    console.log('cron ' + error)
  }
}, {
  scheduled: true,
  timezone: 'America/Guatemala'
})

// Rutas
app.use('/api/bot', botDataRoute)

app.listen({ port: PORT }, () => console.log(`Example app listening on port ${PORT}!`))
