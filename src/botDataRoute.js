import express from 'express'

// firebase
import db from './firebaseInitialize'

// Emails
import nodemailer from 'nodemailer'

// Utils
import { formatDate } from './utils'
import { config } from 'dotenv'

const router = express.Router()

config()
const {
    EMAIL_USER,
    EMAIL_PASSWORD,
    CC
} = process.env

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

  const sendMail = await mailer(data)
  // const sendFirebase
  await saveFirebase(data)
  res.status(200).json({ mail: sendMail })
})

// api/bot/dailyReport
router.post('/dailyReport', async (req, res) => { 
  let { fecha, to, cc } = req.body
  const refLog = db.database().ref('/logChatBot/2019-08-19')
  var usersRef = refLog.once('value').then(function(dataSnapshot) {
    dataSnapshot.forEach(function(data) {
      console.log("The " + data.key)
      console.log(data.val())
    });
  });

  res.status(200).json({ mail: true })
})

const saveFirebase = async (data) => {
    const refLog = db.database().ref('/logChatBot')
    const currentDate = new Date()
    const timestamp = currentDate.getTime()
    const dateString = formatDate(currentDate)
    await refLog.child(dateString).push({
      nombre: data.nombre,
      telefono: data.telefono,
      cedula: data.cedula,
      tipoDeGestion: data.tipoDeGestion,
      email: data.email,
      to: data.to,
      fechaLog: dateString,
      timestamp: timestamp
    })
}

const mailer = async ({ to, nombre, telefono, cedula, email, tipoDeGestion }) => {
    // return false
    try {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
          user: EMAIL_USER, // generated ethereal user
          pass: EMAIL_PASSWORD // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false
        }
      })
  
      // setup email data with unicode symbols
      let mailOptions = {
        from: EMAIL_USER,
        to: to,
        subject: tipoDeGestion,
        cc: CC,
        html: `<table>
                <tr>
                    <td>Nombre</td>
                    <td>${nombre}</td>
                </tr>
                <tr>
                    <td>Telefono</td>
                    <td>${telefono}</td>
                </tr>
                <tr>
                    <td># de cedula</td>
                    <td>${cedula}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>${email}</td>
                </tr>
                <tr>
                    <td>Tipo de consulta</td>
                    <td>${tipoDeGestion}</td>
                </tr>
                <Table>
                `
      }
  
      // send mail with defined transport object
      await transporter.sendMail(mailOptions)
  
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

export default router