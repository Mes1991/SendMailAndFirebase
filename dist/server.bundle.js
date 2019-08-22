!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=6)}([function(e,t){e.exports=require("dotenv")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("firebase")},function(e,t){e.exports=require("nodemailer")},function(e,t){e.exports=require("node-cron")},function(e,t){e.exports=require("@babel/polyfill")},function(e,t,n){"use strict";n.r(t);n(5);var r=n(1),o=n.n(r),a=n(0),u=n(2);Object(a.config)();var i=process.env,c={apiKey:i.APIKEY,authDomain:i.AUTHDOMAIN,databaseURL:i.DATABASEURL,projectId:i.PROJECTID,storageBucket:"",messagingSenderId:i.MESSAGINGSENDERID,appId:i.APPID},l=u.initializeApp(c),s=n(3),d=n.n(s);function p(e,t,n,r,o,a,u){try{var i=e[a](u),c=i.value}catch(e){return void n(e)}i.done?t(c):Promise.resolve(c).then(r,o)}function f(e){return function(){var t=this,n=arguments;return new Promise(function(r,o){var a=e.apply(t,n);function u(e){p(a,r,o,u,i,"next",e)}function i(e){p(a,r,o,u,i,"throw",e)}u(void 0)})}}Object(a.config)();var h=process.env,b=h.EMAIL_USER,m=h.EMAIL_PASSWORD,v=h.CC,g=h.TO_MAIL,y=function(e){var t=""+(e.getMonth()+1),n=""+e.getDate(),r=e.getFullYear();return t.length<2&&(t="0"+t),n.length<2&&(n="0"+n),[r,t,n].join("-")},x=function(e){var t=e.getFullYear(),n=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][e.getMonth()];return e.getDate()+" "+n+" "+t+" "+e.getHours()+":"+e.getMinutes()+":"+e.getSeconds()},w=d.a.createTransport({service:"gmail",secure:!1,auth:{user:b,pass:m},tls:{rejectUnauthorized:!1}}),k=function(){var e=f(regeneratorRuntime.mark(function e(t){var n,r,o,a,u,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.to,n=t.nombre,r=t.telefono,o=t.cedula,a=t.email,u=t.tipoDeGestion,e.prev=1,i={from:b,to:g,subject:u,cc:v,html:"<table>\n                <tr>\n                    <td>Nombre</td>\n                    <td>".concat(n,"</td>\n                </tr>\n                <tr>\n                    <td>Telefono</td>\n                    <td>").concat(r,"</td>\n                </tr>\n                <tr>\n                    <td># de cedula</td>\n                    <td>").concat(o,"</td>\n                </tr>\n                <tr>\n                    <td>Email</td>\n                    <td>").concat(a,"</td>\n                </tr>\n                <tr>\n                    <td>Tipo de consulta</td>\n                    <td>").concat(u,"</td>\n                </tr>\n                <Table>\n                ")},e.next=5,w.sendMail(i);case 5:return e.abrupt("return",!0);case 8:return e.prev=8,e.t0=e.catch(1),console.error(e.t0),e.abrupt("return",!1);case 12:case"end":return e.stop()}},e,null,[[1,8]])}));return function(t){return e.apply(this,arguments)}}(),D=function(){var e=f(regeneratorRuntime.mark(function e(t,n){var r,o,a,u,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,r="",0===t.length)r='<tr>\n                 <td style="padding: 1%;" colspan="6">Sin datos</td>\n                </tr>';else for("#ffffff",o="No proporcionado",a=0;a<t.length;a++)r+='<tr style="border-bottom: 1px solid #dee2e6; background:'+(a%2==0?"#dee2e6":"#ffffff")+'">\n                    <td>'+(a+1)+'</td>\n                    <td style="padding: 0.6%; word-break: break-all">'+("null"!==t[a].nombre?t[a].nombre:o)+'</td>\n                    <td style="padding: 0.6%; word-break: break-all">'+("null"!==t[a].cedula?t[a].cedula:o)+'</td>\n                    <td style="padding: 0.6%; word-break: break-all">'+("null"!==t[a].telefono?t[a].telefono:o)+'</td>\n                    <td style="padding: 0.6%; word-break: break-all">'+("null"!==t[a].tipoDeGestion?t[a].tipoDeGestion:o)+'</td>\n                    <td style="padding: 0.6%; word-break: break-all">'+("null"!==t[a].email?t[a].email:o)+'</td>\n                    <td style="padding: 0.6%; word-break: break-all">'+("null"!==t[a].fechaLog?t[a].fechaLog:o)+"</td>\n                   </tr>";return u='\n    <html lang="en">\n        <head>\n            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n            <meta name="viewport" content="width=device-width, initial-scale=1">\n            <meta http-equiv="X-UA-Compatible" content="IE=edge">\n            <title></title>\n            <style type="text/css">\n            </style>    \n        </head>\n        <body style="margin:0; padding:0; background-color:#F2F2F2;">\n        <center>\n            <h2 style="margin-bottom: 2%; margin-top: 2%"> '+n+": "+t.length+' registros</h2>\n            <table width="100%" border="0" cellpadding="1" cellspacing="2" bgcolor="whiteSmoke">\n                <thead>\n                    <tr style=\'border: 1px\'>\n                        <th style="min-width: 35px" scope="col">#</th>\n                        <th scope="col">Nombre</th>\n                        <th scope="col">Cédula</th>\n                        <th scope="col">Teléfono</th>\n                        <th scope="col">Gestión</th>\n                        <th scope="col">Email</th>\n                        <th scope="col">Fecha</th>\n                    </tr>\n                </thead>\n                <tbody>\n                '+r+"\n                </tbody>\n            </table>\n        </center>\n        </body>\n    </html>",i={from:b,to:g,subject:"ChatBot Consolidate - "+n,cc:v,html:u},e.next=7,w.sendMail(i);case 7:return e.abrupt("return",!0);case 10:return e.prev=10,e.t0=e.catch(0),e.abrupt("return",!1);case 13:case"end":return e.stop()}},e,null,[[0,10]])}));return function(t,n){return e.apply(this,arguments)}}(),R=function(){var e=f(regeneratorRuntime.mark(function e(t){var n,r,o,a,u,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=void 0!==t?new Date(t):new Date,r=y(n),o=[],a=l.database().ref("/logChatBot/"+r),u={},e.next=8,a.once("value").then(function(e){e.forEach(function(e){void 0!==(u=e.val())&&"testingBot"!==u.tipoDeGestion&&o.push(u)})});case 8:return e.next=10,D(o,r);case 10:return i=e.sent,e.next=13,j(o.length,i);case 13:return e.abrupt("return",i);case 16:return e.prev=16,e.t0=e.catch(0),e.abrupt("return",!1);case 19:case"end":return e.stop()}},e,null,[[0,16]])}));return function(t){return e.apply(this,arguments)}}(),j=function(){var e=f(regeneratorRuntime.mark(function e(t,n){var r,o,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,r=l.database().ref("/nodeCron"),o=new Date,a=x(o),e.next=6,r.child(a).push({totalData:t,sendMail:n});case 6:return e.abrupt("return",!0);case 9:return e.prev=9,e.t0=e.catch(0),e.abrupt("return",!1);case 12:case"end":return e.stop()}},e,null,[[0,9]])}));return function(t,n){return e.apply(this,arguments)}}();function S(e,t,n,r,o,a,u){try{var i=e[a](u),c=i.value}catch(e){return void n(e)}i.done?t(c):Promise.resolve(c).then(r,o)}function A(e){return function(){var t=this,n=arguments;return new Promise(function(r,o){var a=e.apply(t,n);function u(e){S(a,r,o,u,i,"next",e)}function i(e){S(a,r,o,u,i,"throw",e)}u(void 0)})}}var E=o.a.Router();E.post("/sendData",function(){var e=A(regeneratorRuntime.mark(function e(t,n){var r,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if((t.headers.authorization||null)===process.env.SECRET){e.next=3;break}return e.abrupt("return",n.status(401).json({error:"No credentials sent!"}));case 3:if(r={nombre:t.body.nombre||null,telefono:t.body.telefono||null,cedula:t.body.cedula||null,tipoDeGestion:t.body.tipoDeGestion||null,email:t.body.email||null,to:t.body.to||null},"testingBot"===t.body.tipoDeGestion){e.next=10;break}return e.next=7,k(r);case 7:e.t0=e.sent,e.next=11;break;case 10:e.t0=!1;case 11:return o=e.t0,e.next=14,M(r);case 14:n.status(200).json({mail:o});case 15:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}()),E.post("/dailyReport",function(){var e=A(regeneratorRuntime.mark(function e(t,n){var r,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r=t.body.fecha,o=R(r),n.status(200).json({mail:o});case 3:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}());var M=function(){var e=A(regeneratorRuntime.mark(function e(t){var n,r,o,a,u;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=l.database().ref("/logChatBot"),r=new Date,o=r.getTime(),a=y(r),u=x(r),e.next=7,n.child(a).push({nombre:t.nombre,telefono:t.telefono,cedula:t.cedula,tipoDeGestion:t.tipoDeGestion,email:t.email,to:t.to,fechaLog:u,timestamp:o});case 7:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),P=E,O=n(4),T=n.n(O);function G(e,t,n,r,o,a,u){try{var i=e[a](u),c=i.value}catch(e){return void n(e)}i.done?t(c):Promise.resolve(c).then(r,o)}function I(e){return function(){var t=this,n=arguments;return new Promise(function(r,o){var a=e.apply(t,n);function u(e){G(a,r,o,u,i,"next",e)}function i(e){G(a,r,o,u,i,"throw",e)}u(void 0)})}}Object(a.config)();var C=process.env.PORT,_=o()();_.use(o.a.json()),T.a.schedule("01 22 * * *",I(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,R();case 3:e.next=8;break;case 5:e.prev=5,e.t0=e.catch(0),console.log("cron "+e.t0);case 8:case"end":return e.stop()}},e,null,[[0,5]])})),{scheduled:!0,timezone:"America/Guatemala"}),_.use("/api/bot",P),_.listen({port:C},function(){return console.log("Example app listening on port ".concat(C,"!"))})}]);