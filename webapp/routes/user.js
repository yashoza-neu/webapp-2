const express = require('express');
const router = express.Router();
const emailValidator = require('email-validator');
const validator = require('../services/validator');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const moment = require('moment');
const mysql = require('../services/db');
const saltRounds = 10;
const checkUser = require('../services/auth');
const log4js = require('log4js');
log4js.configure({
     appenders: { logs: { type: 'file', filename: 'logs/webapp.log' } },
     categories: { default: { appenders: ['logs'], level: 'info' } }
});
const logger = log4js.getLogger('logs');
const SDC = require('statsd-client'),
    sdc = new SDC({ host: 'localhost', port: 8125 });
// protected routes

// To update the user information
router.put('/self', checkUser.authenticate, (req, res) => {
     sdc.increment('PUT User Triggered');
     let timer = new Date();
     if (res.locals.user) {
          if (Object.keys(req.body).length > 0) {
               let contentType = req.headers['content-type'];
               if (contentType == 'application/json') {
                    let id = req.body.id;
                    let password = req.body.password;
                    let email_address = req.body.email_address;
                    let account_created = req.body.account_created;
                    let account_updated = req.body.account_updated;
                    if (password != null && validator.schema.validate(password)) {
                         let hashedPassword = bcrypt.hashSync(password, 10);
                         req.body.password = hashedPassword;
                    } else if (password != null) {
                         logger.error('Invalid Request body');
                         return res.status(400).json({ msg: 'Bad Request1' });
                    }
                    if (id != null || email_address != null || account_created != null || account_updated != null) {
                         logger.error('Invalid Request body');
                         return res.status(400).json({ msg: 'Bad Request2' });
                    } else {
                         let update_set = Object.keys(req.body).map(value => {
                              return ` ${value}  = "${req.body[value]}"`;
                         });
                         mysql.query(`UPDATE UserDB.User SET ${update_set.join(" ,")}, account_updated=(?) WHERE email_address = (?)`, [moment().format('YYYY-MM-DD HH:mm:ss'), res.locals.user.email_address], function (error, results) {
                              if (error) {
                                   logger.error('Invalid Request body');
                                   return res.status(400).json({ msg: 'Bad Request3' });
                              } else {
                                   res.status(204).json();
                              }
                         });
                    }
               } else {
                    logger.error('Invalid Request body');
                    res.status(400).json({ msg: 'Bad Request4' });
               }
          } else {
               logger.error('Invalid Request body');
               res.status(400).json({ msg: 'Bad Request5' });
          }
     } else {
          logger.error('Unauthorized');
          res.status(401).json({ msg: 'Unauthorized' });
     }
     sdc.timing('put.user.time', timer);
});

// To get the user information
router.get('/self', checkUser.authenticate, (req, res) => {
     sdc.increment('GET User Triggered');
     let timer = new Date();
     if (res.locals.user) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(res.locals.user);

     }
     logger.info('Get User Triggered');
     sdc.timing('get.user.time', timer);
});



router.post('/', (req, res, next) => {
     sdc.increment('POST User Triggered');
     let timer = new Date();
     let contentType = req.headers['content-type'];
     if (contentType == 'application/json') {
          let first_name = req.body.first_name;
          let last_name = req.body.last_name;
          let password = req.body.password;
          let email_address = req.body.email_address;


          if (first_name != null && last_name != null && password != null && email_address != null && validator.schema.validate(password) == true && emailValidator.validate(email_address) == true) {
               let salt = bcrypt.genSaltSync(saltRounds);
               let hashedPassword = bcrypt.hashSync(password, salt);
               const id = uuid();
               const account_created = moment().format('YYYY-MM-DD HH:mm:ss');
               const account_updated = moment().format('YYYY-MM-DD HH:mm:ss');

               mysql.query('insert into UserDB.User(`id`,`first_name`,`last_name`,`password`,`email_address`,`account_created`,`account_updated`)values(?,?,?,?,?,?,?)',
                    [id, first_name, last_name, hashedPassword, email_address, account_created, account_updated], (err, result) => {
                         if (err) {
                              logger.error('Email already exists');
                              console.log(err);
                              res.status(400).json({ msg: ` Email: ${email_address} already exists!`, error: `${err}` });
                         }
                         else {
                              logger.info('User Created');
                              //res.status(201).json(`User created successfully!Created email: ${email_address}`);
                              res.status(201).json({
                                   id: id,
                                   first_name: first_name,
                                   last_name: last_name,
                                   email_address: email_address,
                                   account_created: account_created,
                                   account_updated: account_updated
                              });
                         }
                    });
          }
          else if (first_name == null || last_name == null || password == null || email_address == null) {
               logger.error('Invalid Request body');
               res.status(400).json({ msg: 'Please enter all details!' });
          }
          else if (emailValidator.validate(email_address) == false) {
               logger.error('Invalid Email');
               res.status(400).json({ msg: `${email_address} is not a valid email!` });
          }
          else {
               logger.error('Invalid password');
               res.status(400).json({
                    msg: 'Password must be: atleast 8 letters & should contain an uppercase, a lowercase, a digit & a symbol! No spaces allowed'
               });
          }
     }
     else {
          logger.error('Invalid Request body');
          res.status(400).json({ msg: 'Request type must be JSON!' });
     }
     sdc.timing('post.user.time', timer);
});
module.exports = router;
