const mysql = require('mysql');

//mysql database connection
module.exports = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database:"UserDB"
   });