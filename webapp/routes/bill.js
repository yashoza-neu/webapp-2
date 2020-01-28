const express = require('express');
const router = express.Router();
const emailValidator = require('email-validator');
const validator = require('../services/validator');
const bcrypt =require('bcrypt');
const uuid = require('uuid')
const moment = require('moment');
const mysql = require('../services/db');
const saltRounds = 10;
const checkUser = require('../services/auth');
const localTime = require('../services/localTime');
const { check, validationResult } = require('express-validator');

//Posting a new Bill
router.post("/", checkUser.authenticate, validator.validateBill, (req, res, next) => {
    let contentType = req.headers['content-type'];
    if(contentType == 'application/json'){
            let id = uuid();
            let amount = parseFloat(req.body.amount_due);
            let timeStamp = moment().format('YYYY-MM-DD HH:mm:ss');
            mysql.query('insert into UserDB.Bill(`id`,`created_ts`,`updated_ts`,`owner_id`,`vendor`,`bill_date`,`due_date`,`amount_due`,`categories`,`paymentStatus`)values(?,?,?,?,?,?,?,?,?,?)',
                [id,timeStamp, timeStamp,
                res.locals.user.id,
                req.body.vendor,
                req.body.bill_date,
                req.body.due_date,
                amount,
                JSON.stringify(req.body.categories),
                req.body.paymentStatus
                ], (err, result) => {
                    if(err){
                        console.log(err);
                        return res.status(400).json({ msg: 'Please enter expected paymentStatus values!' });
                    }
                    else{
                        return res.status(201).json({
                            id: id,
                            created_ts: timeStamp,
                            updated_ts: timeStamp,
                            owner_id: res.locals.user.id,
                            vendor: req.body.vendor,
                            bill_date: req.body.bill_date,
                            due_date: req.body.due_date,
                            amount_due: amount,
                            categories: req.body.categories,
                            paymentStatus: req.body.paymentStatus

                        });
                    }
                });
    }else{
        return res.status(400).json({ msg: '1111 be JSON!' });
    }
});