const mysql = require('mysql');

//mysql database connection
module.exports = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "jerry1919",
    database:"UserDB"
   });