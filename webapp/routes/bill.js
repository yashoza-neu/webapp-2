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
const { upload } = require('../services/image');
const fs = require('fs')
const DIR = './images'
var crypto = require('crypto');

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
        return res.status(400).json({ msg: 'Set content-type' });
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
                    return res.status(404).json({msg: 'no data with ID found'});
                }

            });
        } else {
            return res.status(400).json({ msg: 'Set content-type' });
        }
    } else {
        return res.status(401).json({ msg: 'Authentication error' });
    }
});

//Get all bills
router.get("/",checkUser.authenticate, (req, res) => {
    if (res.locals.user) {
        let contentType = req.headers['content-type'];
        if (contentType == 'application/json') {
            mysql.query('select * from UserDB.Bill where owner_id=(?)', [res.locals.user.id], (err, data) => {
                if (err) {
                    return res.status(400).json();
                }
                else if (data[0] != null) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].created_ts = localTime(data[i].created_ts);
                        data[i].updated_ts = localTime(data[i].updated_ts);
                        data[i].owner_id;
                        data[i].vendor;
                        data[i].bill_date = data[i].bill_date.toISOString().split('T')[0];
                        data[i].due_date = data[i].due_date.toISOString().split('T')[0];
                        data[i].amount_due;
                        data[i].categories =  JSON.parse(data[i].categories);
                        data[i].paymentStatus;
                    }
                    return res.status(200).json(data);
                } else {
                    return res.status(404).json({ msg: 'No data found for user' });
                }

            });
        } else {
            return res.status(400).json({ msg: 'Set content-type' });
        }
    } else{
        return res.status(401).json({ msg: 'Authentication error' });
    }
});

//Delete a Bill
router.delete('/:id', checkUser.authenticate, (req, res) => {
    if (res.locals.user) {
        mysql.query('select * from UserDB.Bill where id=(?)', [req.params.id], (err, result) => {
            if (result[0] != null) {
                if (result[0].owner_id === res.locals.user.id) {
                    mysql.query('delete from UserDB.Bill where id=(?)', [req.params.id], (err, result) => {
                        if (err) {
                            return res.status(404).json();
                        } else {
                            return res.status(200).json({msg: 'Deleted Successfully'});
                        }
                    });
                } else {
                    return res.status(401).json({msg: 'Authentication Error, check user'});
                }
            } else {
                return res.status(404).json({msg: 'No record with this ID found'});
            }
        });
    } else {
        return res.status(401).json({msg: 'Authentication error'});
    }
});

//Change a bill
router.put("/:id",checkUser.authenticate, validator.validateBill, (req,res) => {
    if(res.locals.user){
        if(req.body.owner_id != null || req.body.created_ts != null || req.body.updated_ts != null ||
            req.body.id != null){
                return res.status(400).json({ msg: 'Cannot update id, created_ts, updated_ts and owner_id' });
            } else{
                mysql.query('select * from UserDB.Bill where id=(?)', [req.params.id], (err, result) => {
                    if(result[0] != null){
                        if(result[0].owner_id === res.locals.user.id){
                            let contentType = req.headers['content-type'];
                            if(contentType == 'application/json'){
                                    let updatedTimeStamp = moment().format('YYYY-MM-DD HH:mm:ss');
                                    let createdTimeStamp = localTime(result[0].created_ts);
                                    let amount = parseFloat(req.body.amount_due);
                                    mysql.query(`UPDATE UserDB.Bill SET
                                    vendor = (?),
                                    bill_date = (?),
                                    due_date = (?),
                                    amount_due = (?),
                                    categories = (?),
                                    paymentStatus = (?),
                                    updated_ts = (?)
                                    WHERE id = (?)`,
                                    [req.body.vendor,
                                    req.body.bill_date,
                                    req.body.due_date,
                                    amount,
                                    JSON.stringify(req.body.categories),
                                    req.body.paymentStatus,
                                    updatedTimeStamp,
                                    req.params.id], (err, results) => {
                                        if(err){
                                            return res.status(404).json({ msg: 'Please Enter all details' });
                                        }else{
                                            return res.status(201).json({
                                                id: req.params.id,
                                                created_ts: createdTimeStamp,
                                                updated_ts: updatedTimeStamp,
                                                owner_id: res.locals.user.id,
                                                vendor: req.body.vendor,
                                                bill_date: req.body.bill_date,
                                                due_date: req.body.due_date,
                                                amount_due: req.body.amount_due,
                                                categories: req.body.categories,
                                                paymentStatus: req.body.paymentStatus
                    
                                            }); 
                                        }
                                    })
                            }
                            else{
                                return res.status(404).json({ msg: 'Set content-type' });
                            }
                        }
                        else{
                            return res.status(404).json({ msg: 'Authentication Error, check user' });
                        }
                    }
                    else{
                        return res.status(404).json({ msg: 'No bill with this ID found' });
                    }
                })
            }
    }else{
        return res.status(404).json({ msg: 'Authentication error' });
    }
});

// Post Attachment to existing bill
 router.post("/:id/file", checkUser.authenticate, upload.single('file'),  (req, res, next) => {
     let id = uuid();
     let uploadDate = moment().format('YYYY-MM-DD');
     mysql.query('select * from UserDB.Bill where id=(?)', [req.params.id], (err, result) => {
        if (result[0] != null) {
            if (result[0].owner_id === res.locals.user.id) {
                if (result[0].attachment != null) {
                    return res.status(400).json({ msg: 'Please delete the previous image before re-uploading' });
                } else {
                    //console.log(uploadDate);
                    //console.log(req.file.filename);
                    //console.log( req.file.path);
                    let hash = crypto.createHash('md5').update(req.file.filename).digest('hex');
                    let attachment = {
                        'id': id,
                        'url': req.file.path,
                        'file_name' : req.file.filename,
                        'upload_date' : uploadDate
                    };
                    //console.log(req.file.size);
                    mysql.query('insert into UserDB.File(`id`,`file_name`,`url`,`upload_date`,`metadata`)values(?,?,?,?,?)'
                    , [id, req.file.filename, req.file.path, uploadDate, hash], (err, result) => {
                    if(!err){
                        mysql.query('UPDATE UserDB.Bill SET attachment=(?) where id=(?)', [JSON.stringify(attachment), req.params.id], (err, result) => {
                            if (!err) {
                                return res.status(201).json(attachment);
                            } else {
                                return res.status(500).json({ msg: 'Some error while storing attachment data to DB' });
                            }
                        });
                    }else{
                        return res.status(500).json({msg: 'Unsupported filetype'});
                    }
                });
                }
            }else{
                return res.status(401).json({ msg: 'Unauthorized' });
            }
        }else{
            return res.status(404).json({ msg: 'Bill Not Found' });
        }
    });
 });

 // Get Attachment with attachmentId and BillId
router.get('/:billId/file/:fileId', checkUser.authenticate, (req, res) => {
    if (res.locals.user) {
        mysql.query('select attachment from UserDB.Bill where id=(?) and owner_id=(?)', [req.params.billId, res.locals.user.id], (err, data) => {
            if (data[0] != null) {
                if (data[0].attachment != null) {
                    data[0].attachment = JSON.parse(data[0].attachment);
                    if (req.params.fileId === data[0].attachment.id) {
                        return res.status(200).json(data[0].attachment);
                    } else {
                        return res.status(404).json({ msg: 'Image not found' });
                    }
                } else {
                    return res.status(404).json({ msg: 'Image not found!' });
                }
            } else {
                return res.status(404).json({ msg: 'Bill Not Found!' });
            }
        });
    }else{
        return res.status(404).json({ msg: 'Authentication error' });
    }
});

//Delete attachment
router.delete('/:billId/file/:fileId', checkUser.authenticate, (req, res) => {
    if (res.locals.user) {
        mysql.query('select attachment from UserDb.Bill where id=(?)', [req.params.billId], (err, data) => {
            if (data[0] != null) {
                if (data[0].attachment != null) {
                    data[0].attachment = JSON.parse(data[0].attachment);
                    if (req.params.fileId === data[0].attachment.id) {
                        mysql.query(`UPDATE UserDb.Bill SET attachment=(?) where id=(?)`, [null,  req.params.billId], (err, result) => {
                            if (err) {
                                return res.status(500).json({ msg: err });
                            } else {
                                mysql.query(`Select * from UserDb.File where id=(?)`, [req.params.fileId], (err, result) => {
                                    if (err) {
                                        return res.status(500).json({ msg: err });
                                    }else{
                                        if(result[0]!= null){
                                            let filename = result[0].file_name;
                                            console.log(filename);
                                            fs.unlinkSync(DIR+'/'+filename);
                                            mysql.query(`Delete from UserDb.File where id=(?)`, [req.params.fileId], (err, result) => {
                                            });
                                        }
                                    }
                                });
                                return res.status(204).json("Attachment Deleted");
                            }
                        });

                    } else {
                        return res.status(400).json({ msg: 'Attachment Not Found!' });
                    }
                }
                else {
                    return res.status(404).json({ msg: 'Attachment Not Found!' });
                }
            } else {
                return res.status(404).json({ msg: 'Attachmnet/Bill Not Found!' });
            }
        });
    }
    else {
        return res.status(401).json({ msg: 'User unauthorized!' });
    }
});

module.exports = router;