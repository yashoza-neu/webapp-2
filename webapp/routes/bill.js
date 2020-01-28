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

//Get a bill
router.get("/:id", checkUser.authenticate, (req, res) => {
    if (res.locals.user) {
        let contentType = req.headers['content-type'];
        if (contentType == 'application/json') {
            mysql.query('select * from UserDB.Bill where id=(?) and owner_id=(?)', [req.params.id, res.locals.user.id], (err, data) => {
                if (err) {
                    return res.status(400).json();
                }
                else if (data[0] != null) {
                    console.log(data[0]);
                    data[0].created_ts = localTime(data[0].created_ts);
                    data[0].updated_ts = localTime(data[0].updated_ts);
                    data[0].owner_id;
                    data[0].vendor;
                    data[0].bill_date = data[0].bill_date.toISOString().split('T')[0];
                    data[0].due_date = data[0].due_date.toISOString().split('T')[0];
                    data[0].amount_due;
                    data[0].categories =  JSON.parse(data[0].categories);
                    data[0].paymentStatus;
                    return res.status(200).json(data[0]);
                } else {
                    return res.status(404).json();
                }

            });
        } else {
            return res.status(400).json();
        }
    } else {
        return res.status(401).json();
    }
});