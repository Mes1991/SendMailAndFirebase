import express from 'express'
import * as firebase from 'firebase'
import { config } from 'dotenv'
import cryptoRandomString from 'crypto-random-string'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// Emails
import nodemailer from 'nodemailer'

config()
const {
  PORT,
  EMAIL_PASSWORD,
  EMAIL_USER,
  CC,
  APIKEY,
  AUTHDOMAIN,
  DATABASEURL,
  PROJECTID, 
  MESSAGINGSENDERID,
  APPID
} = process.env

const app = express()
app.use(express.json())

const FIREBASECONFIG = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  databaseURL: DATABASEURL,
  projectId: PROJECTID,
  storageBucket: '',
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID
}

// Initiualize firebase app on the server
let db = firebase.initializeApp(FIREBASECONFIG)

app.post('/senData', async (req,res) => {
  var secret = req.headers.authorization || null
  if (!secret || secret !== process.env.SECRET) {
    return res.status(403).json({ error: 'No credentials sent!' })
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

const saveFirebase = async (data) => {
  const refLog = db.database().ref('/logChatBot')
  const currentDate = new Date()
  const timestamp = currentDate.getTime()
  const dateString = formatDate(currentDate)
  const randomString = cryptoRandomString({ length: 4, characters: '1234' })
  await refLog.child(dateString).push({
    nombre: data.nombre,
    telefono: data.telefono,
    cedula: data.cedula,
    tipoDeGestion: data.tipoDeGestion,
    email: data.email,
    to: data.to,
    fechaLog: dateString,
    timestamp: timestamp,
    random: randomString
  })
  /*
  if (!firebase.apps.length) {
    const dbFire = firebase.initializeApp(FIREBASECONFIG)
    const refLog = dbFire.database().ref('/logChatBot')
    const currentDate = new Date()
    const timestamp = currentDate.getTime()
    const dateString = formatDate(currentDate)
    const randomString = cryptoRandomString({ length: 4, characters: '1234' })
    refLog.child(dateString).push({
      nombre: data.nombre,
      telefono: data.telefono,
      cedula: data.cedula,
      tipoDeGestion: data.tipoDeGestion,
      email: data.email,
      to: data.to,
      fechaLog: dateString,
      timestamp: timestamp,
      random: randomString
    })
  }
  */
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

    // console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

const formatDate = (date) => {
  let month = '' + (date.getMonth() + 1)
  let day = '' + date.getDate()
  let year = date.getFullYear()
  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day
  return [year, month, day].join('-')
}

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
