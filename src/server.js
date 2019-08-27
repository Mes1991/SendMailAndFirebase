import '@babel/polyfill'
import express from 'express'
import { config } from 'dotenv'
import botDataRoute from './botDataRoute'
import { createServer } from 'http'
// import enforce from 'express-sslify'
// Cron
import cron from 'node-cron'

import { dailyReportEmail } from './utils'

config()
const {
  PORT,
  CRON_JOB
} = process.env

const app = express()

// app.use(enforce.HTTPS({ trustProtoHeader: true }))

app.use(express.json())

cron.schedule(CRON_JOB, async () => {
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

const httpServer = createServer(app)

httpServer.listen({ port: PORT }, () => console.log(`Example app listening on port ${PORT}!`))
