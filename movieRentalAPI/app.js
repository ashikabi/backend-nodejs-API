require('dotenv').config();
global.codes = require("./utils/statusCode");
global.errors = require("./utils/errors");
global.db = require("./db/dbconnection");
global.jwt = require('jsonwebtoken');
global.tokens = [];
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const routes = require('./routes/index');

global.mailTransporter = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS
  } 
}); 

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(routes);

//URL NOT FOUND
app.use((req,res,next)=> {
  const err = new Error("Not Found: Invalid URL");
  err.status = codes.NOT_FOUND;
  err.type = "Invalid Resource"
  next(err);
});

//MALFORMED JSON
app.use((err,req, res, next) => {
  let message = (err.message.startsWith("Unexpected")? "Malformed JSON" : err.message)
 res.status(err.status || codes.UNPROCESSABLE);
 res.json({
     error: {
         code: err.status || codes.UNPROCESSABLE,
         type: err.type,
         message,
         description: err.message
     }
 });
});

app.listen(process.env.PORT? process.env.PORT:process.env.API_PORT, () => {
  console.log('Listening on port : ', process.env.PORT? process.env.PORT:process.env.API_PORT);
});