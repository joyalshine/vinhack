var express = require('express');
var router = express.Router();
var newUserHelper = require('../Helpers/newUserHelper')
var formAddHelper = require('../Helpers/formAddHelper')
const { response } = require('express');
var fs = require('fs');
const url = require('url');
const multer = require("multer");
require('dotenv').config()
const uuid = require("uuid").v4
const XLSX = require('xlsx')

var nodemailer = require('nodemailer');
const { resolve } = require('path');
const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
            user: 'vitol.vitvellore@gmail.com',
            pass: 'uyasumxbtdkmqcoz'
      },
      tls: {
            rejectUnauthorized: false,
      }
});

router.get('/', function (req, res, next) {
      res.render('index')
});

router.get('/logout', function (req, res, next) {
      req.session.destroy()
      res.redirect("/")
});

router.get('/about-us', function (req, res, next) {
      let status = req.session.loggedIn
      res.render('about', {status})
});

router.post('/home-page', function (req, res, next) {
      req.session.loggedIn = true
      req.session.name = req.body.name
      let user = req.body.name
      res.render('homePage',{user})
});

router.get('/sign-in', function (req, res, next) {
      res.render('signIn')
});

router.get('/home-page', function (req, res, next) {
      if(req.session.loggedIn){
            let user = req.session.name
            res.render('homePage', {user})
      }else{
            res.send('Login to see')
      }
      
});

router.post('/sign-in', function (req, res) {
      formAddHelper.validateSignIn(req.body.email,req.body.password).then((response => {
            res.send(response)
      }))
});

router.post('/signUp', function (req, res) {
      formAddHelper.addNewUser(req.body).then((response => {
            res.redirect('/sign-in')
      }))
});

router.post('/send-otp', function (req, res) {
      const htmlText = `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">SIGNS</a>
              </div>
              <p style="font-size:1.1em">Hi, ${req.body.name}</p>
              <p>This is a auto generated Email. Use the following OTP to reset your Password. OTP is valid for 5 minutes. If you didn't request this, you can ignore this email or let us know.</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${req.body.otp}</h2>
              <p style="font-size:0.9em;">Regards,<br />VITOL</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              </div>
            </div>
          </div>`

      var mailOptions = {
            from: '"SIGNS" <vitol.vitvellore@gmail.com>',
            to: req.body.email,
            subject: 'OTP Verification',
            html: htmlText
      };

      transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                  console.log(error);
            } else {
                  console.log('Email sent: ' + info.response);
            }
      })
});

router.get('/case-studies', function (req, res, next) {
      let status = req.session.loggedIn
      res.render('caseStudies', {status})
});

router.get('/coming-soon', function (req, res, next) {
      let status = req.session.loggedIn
      res.render('comingsoon', {status})
});

router.get('/register-startup', function (req, res, next) {
      res.render('registerStartup')
});


router.get('/how-it-works', function (req, res, next) {
      let status = req.session.loggedIn
      res.render('howitworks', {status})
});

router.post('/', function (req, res) {

});

module.exports = router;








