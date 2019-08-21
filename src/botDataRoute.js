import express from 'express'

// firebase
import db from './firebaseInitialize'

// Utils
import { formatDate, fullDateConverter, mailerOneRecord, mailerMultipleRecord } from './utils'

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
  const sendMail = (req.body.tipoDeGestion !== 'testingBotd') ? await mailerOneRecord(data) : false
  // const sendFirebase
  await saveFirebase(data)
  res.status(200).json({ mail: sendMail })
})

// api/bot/dailyReport
router.post('/dailyReport', async (req, res) => { 
  let { fecha } = req.body

  const currentDate = (fecha !== undefined) ? new Date(fecha) : new Date()
  const dateString = formatDate(currentDate)
  const arrayData = []

  const refLog = db.database().ref('/logChatBot/' + dateString)
  let dataVal = {}
  const usersRef = await refLog.once('value').then(function(dataSnapshot) {
    dataSnapshot.forEach(function(data) {
      // console.log("The " + data.key)
      dataVal = data.val()
      if (dataVal !== undefined && dataVal.tipoDeGestion !== 'testingBot') {
        arrayData.push(dataVal)
      }
    })
  })

  console.log(dateString)
  const sendMail = await mailerMultipleRecord(arrayData, dateString)

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
