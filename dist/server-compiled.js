"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var firebase = _interopRequireWildcard(require("firebase"));

var _dotenv = require("dotenv");

var _cryptoRandomString = _interopRequireDefault(require("crypto-random-string"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _dotenv.config)();
var _process$env = process.env,
    PORT = _process$env.PORT,
    EMAIL_PASSWORD = _process$env.EMAIL_PASSWORD,
    EMAIL_USER = _process$env.EMAIL_USER,
    CC = _process$env.CC,
    APIKEY = _process$env.APIKEY,
    AUTHDOMAIN = _process$env.AUTHDOMAIN,
    DATABASEURL = _process$env.DATABASEURL,
    PROJECTID = _process$env.PROJECTID,
    MESSAGINGSENDERID = _process$env.MESSAGINGSENDERID,
    APPID = _process$env.APPID;
var app = (0, _express["default"])();
app.use(_express["default"].json());
var FIREBASECONFIG = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  databaseURL: DATABASEURL,
  projectId: PROJECTID,
  storageBucket: '',
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID // Initiualize firebase app on the server

};
var db = firebase.initializeApp(FIREBASECONFIG);
app.post('/senData',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var secret, data, sendMail;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            secret = req.headers.authorization || null;

            if (!(!secret || secret !== process.env.SECRET)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(403).json({
              error: 'No credentials sent!'
            }));

          case 3:
            data = {
              nombre: req.body.nombre || null,
              telefono: req.body.telefono || null,
              cedula: req.body.cedula || null,
              tipoDeGestion: req.body.tipoDeGestion || null,
              email: req.body.email || null,
              to: req.body.to || null
            };
            _context.next = 6;
            return mailer(data);

          case 6:
            sendMail = _context.sent;
            _context.next = 9;
            return saveFirebase(data);

          case 9:
            res.status(200).json({
              mail: sendMail
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var saveFirebase =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(data) {
    var refLog, currentDate, timestamp, dateString, randomString;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            refLog = db.database().ref('/logChatBot');
            currentDate = new Date();
            timestamp = currentDate.getTime();
            dateString = formatDate(currentDate);
            randomString = (0, _cryptoRandomString["default"])({
              length: 4,
              characters: '1234'
            });
            _context2.next = 7;
            return refLog.child(dateString).push({
              nombre: data.nombre,
              telefono: data.telefono,
              cedula: data.cedula,
              tipoDeGestion: data.tipoDeGestion,
              email: data.email,
              to: data.to,
              fechaLog: dateString,
              timestamp: timestamp,
              random: randomString
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function saveFirebase(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var mailer =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref3) {
    var to, nombre, telefono, cedula, email, tipoDeGestion, transporter, mailOptions;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            to = _ref3.to, nombre = _ref3.nombre, telefono = _ref3.telefono, cedula = _ref3.cedula, email = _ref3.email, tipoDeGestion = _ref3.tipoDeGestion;
            _context3.prev = 1;
            // create reusable transporter object using the default SMTP transport
            transporter = _nodemailer["default"].createTransport({
              service: 'gmail',
              secure: false,
              auth: {
                user: EMAIL_USER,
                // generated ethereal user
                pass: EMAIL_PASSWORD // generated ethereal password

              },
              tls: {
                rejectUnauthorized: false
              }
            }); // setup email data with unicode symbols

            mailOptions = {
              from: EMAIL_USER,
              to: to,
              subject: tipoDeGestion,
              cc: CC,
              html: "<table>\n              <tr>\n                  <td>Nombre</td>\n                  <td>".concat(nombre, "</td>\n              </tr>\n              <tr>\n                  <td>Telefono</td>\n                  <td>").concat(telefono, "</td>\n              </tr>\n              <tr>\n                  <td># de cedula</td>\n                  <td>").concat(cedula, "</td>\n              </tr>\n              <tr>\n                  <td>Email</td>\n                  <td>").concat(email, "</td>\n              </tr>\n              <tr>\n                  <td>Tipo de consulta</td>\n                  <td>").concat(tipoDeGestion, "</td>\n              </tr>\n              <Table>\n              ") // send mail with defined transport object

            };
            _context3.next = 6;
            return transporter.sendMail(mailOptions);

          case 6:
            return _context3.abrupt("return", true);

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);
            return _context3.abrupt("return", false);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 9]]);
  }));

  return function mailer(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var formatDate = function formatDate(date) {
  var month = '' + (date.getMonth() + 1);
  var day = '' + date.getDate();
  var year = date.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

app.listen({
  port: PORT
}, function () {
  return console.log("Example app listening on port ".concat(PORT, "!"));
});
