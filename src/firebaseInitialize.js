import { config } from 'dotenv'
import * as firebase from 'firebase'

config()
const {
  APIKEY,
  AUTHDOMAIN,
  DATABASEURL,
  PROJECTID, 
  MESSAGINGSENDERID,
  APPID
} = process.env

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

export default db