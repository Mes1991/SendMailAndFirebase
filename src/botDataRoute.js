import express from 'express'

// firebase
import db from './firebaseInitialize'

// Utils
import { formatDate, fullDateConverter, mailerOneRecord, dailyReportEmail } from './utils'

const router = express.Router()

// api/bot/sendData
router.post('/sendData', async (req, res) => {
  const secret = req.headers.authorization || null
  if (secret !== process.env.SECRET) {
    return res.status(401).json({ error: 'No credentials sent!' })
  }

  let data = {
    nombre: req.body.nombre || null,
    telefono: req.body.telefono || null,
    cedula: req.body.cedula || null,
    tipoDeGestion: req.body.tipoDeGestion || null,
    email: req.body.email || null,
    to: req.body.to || null
  }
  const sendMail = (req.body.nombre !== 'testingChatBot') ? await mailerOneRecord(data) : false
  // const sendFirebase
  await saveFirebase(data)
  res.status(200).json({ mail: sendMail })
})

// api/bot/dailyReport
router.post('/dailyReport', async (req, res) => {
  let { fecha } = req.body
  const secret = req.headers.authorization || null
  if ((secret + '_dailyReport') !== process.env.SECRET) {
    return res.status(401).json({ error: 'No credentials sent!' })
  }
  let sendMail = await dailyReportEmail(fecha)
  res.status(200).json({ mail: sendMail })
})

const saveFirebase = async (data) => {
  const refLog = db.database().ref('/logChatBot')
  const currentDate = new Date()
  const timestamp = currentDate.getTime()
  const dateSimpleString = formatDate(currentDate)
  const fullDateString = fullDateConverter(currentDate)
  await refLog.child(dateSimpleString).push({
    nombre: data.nombre,
    telefono: data.telefono,
    cedula: data.cedula,
    tipoDeGestion: data.tipoDeGestion,
    email: data.email,
    to: data.to,
    fechaLog: fullDateString,
    timestamp: timestamp
  })
}

export default router
