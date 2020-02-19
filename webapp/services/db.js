const mysql = require('mysql');

//mysql database connection
module.exports = mysql.createConnection({
    host:process.env.MYSQLHOST,
    user:process.env.MYSQLUSER,
    password:process.env.MYSQLPASSWORD,
    database:process.env.DATABASE
   });