// Emails
import nodemailer from 'nodemailer'
import { config } from 'dotenv'

// firebase
import db from './firebaseInitialize'

config()
const {
  EMAIL_USER,
  EMAIL_PASSWORD,
  CC,
  TO_CONSOLIDATE,
  TO_INMEDIATE
} = process.env

export const formatDate = (date) => {
  let month = '' + (date.getMonth() + 1)
  let day = '' + date.getDate()
  let year = date.getFullYear()
  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day
  return [year, month, day].join('-')
}

export const fullDateConverter = (date) => {
  let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  let year = date.getFullYear()
  let month = months[date.getMonth()]
  let day = date.getDate()
  let hour = date.getHours()
  let min = date.getMinutes()
  let sec = date.getSeconds()
  let time = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}

// create reusable transporter object using the default SMTP transport
const TRANSPORTER = nodemailer.createTransport({
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

export const mailerOneRecord = async ({ to, nombre, telefono, cedula, email, tipoDeGestion }) => {
  try {
    // setup email data with unicode symbols
    let mailOptions = {
      from: EMAIL_USER,
      to: TO_INMEDIATE,
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
    await TRANSPORTER.sendMail(mailOptions)

    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export const mailerMultipleRecord = async (data, dateString) => {
  try {
    let trData = ''
    if (data.length === 0) {
      trData = `<tr>
                 <td style="padding: 1%;" colspan="6">Sin datos</td>
                </tr>`
    } else {
      let background = '#ffffff'
      let nullText = 'No proporcionado'
      for (let i = 0; i < data.length; i++) {
        background = (i % 2 === 0) ? '#dee2e6' : '#ffffff'
        trData += `<tr style="border-bottom: 1px solid #dee2e6; background:` + background + `">
                    <td>` + (i + 1) + `</td>
                    <td style="padding: 0.6%; word-break: break-all">` + ((data[i].nombre !== 'null') ? data[i].nombre : nullText) + `</td>
                    <td style="padding: 0.6%; word-break: break-all">` + ((data[i].cedula !== 'null') ? data[i].cedula : nullText) + `</td>
                    <td style="padding: 0.6%; word-break: break-all">` + ((data[i].telefono !== 'null') ? data[i].telefono : nullText) + `</td>
                    <td style="padding: 0.6%; word-break: break-all">` + ((data[i].tipoDeGestion !== 'null') ? data[i].tipoDeGestion : nullText) + `</td>
                    <td style="padding: 0.6%; word-break: break-all">` + ((data[i].email !== 'null') ? data[i].email : nullText) + `</td>
                    <td style="padding: 0.6%; word-break: break-all">` + ((data[i].fechaLog !== 'null') ? data[i].fechaLog : nullText) + `</td>
                   </tr>`
      }
    }

    const htmlTemplate = `
    <html lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title></title>
            <style type="text/css">
            </style>    
        </head>
        <body style="margin:0; padding:0; background-color:#F2F2F2;">
        <center>
            <h2 style="margin-bottom: 2%; margin-top: 2%"> ` + dateString + `: ` + data.length + ` registros</h2>
            <table width="100%" border="0" cellpadding="1" cellspacing="2" bgcolor="whiteSmoke">
                <thead>
                    <tr style='border: 1px'>
                        <th style="min-width: 35px" scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Cédula</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Gestión</th>
                        <th scope="col">Email</th>
                        <th scope="col">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                ` + trData + `
                </tbody>
            </table>
        </center>
        </body>
    </html>`

    let mailOptions = {
      from: EMAIL_USER,
      to: TO_CONSOLIDATE,
      subject: 'ChatBot Consolidate - ' + dateString,
      cc: CC,
      html: htmlTemplate
    }
    // send mail with defined transport object
    await TRANSPORTER.sendMail(mailOptions)

    return true
  } catch (error) {
    return false
  }
}

export const dailyReportEmail = async (fecha) => {
  try {
    const currentDate = (fecha !== undefined) ? new Date(fecha) : new Date()
    const dateString = formatDate(currentDate)
    const arrayData = []

    const refLog = db.database().ref('/logChatBot/' + dateString)
    let dataVal = {}
    await refLog.once('value').then(function (dataSnapshot) {
      dataSnapshot.forEach(function (data) {
        // console.log("The " + data.key)
        dataVal = data.val()
        if (dataVal !== undefined && dataVal.tipoDeGestion !== 'testingBot') {
          arrayData.push(dataVal)
        }
      })
    })
    const sendMail = await mailerMultipleRecord(arrayData, dateString)
    await saveNodeCron(arrayData.length, sendMail)
    return sendMail
  } catch (error) {
    return false
  }
}

export const saveNodeCron = async (totalData, sendMail) => {
  try {
    const refLog = db.database().ref('/nodeCron')
    const currentDate = new Date()
    const fullDateString = fullDateConverter(currentDate)
    await refLog.child(fullDateString).push({
      totalData: totalData,
      sendMail: sendMail,
      toEmail: TO_CONSOLIDATE
    })
    return true
  } catch (error) {
    return false
  }
}
