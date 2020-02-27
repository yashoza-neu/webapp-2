const mysql = require('mysql');

//mysql database connection
var con = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: 'UserDB'
});

con.connect(function (err) {
    if (err) throw err;
    else {
        console.log("Connected!");
        con.query("DROP DATABASE IF EXISTS UserDB;", function (err, result) {
            if (err) throw err;
            else {
                con.query("CREATE DATABASE UserDB;", function (err, result) {
                    if (err) throw err;
                    else {
                        var sql = `CREATE TABLE UserDB.User(
            id varchar(36) NOT NULL,
            first_name varchar(45) NOT NULL,
            last_name varchar(45) NOT NULL,
            password varchar(100) NOT NULL COMMENT 'User Table updated',
            email_address varchar(320) NOT NULL,
            account_created datetime DEFAULT NULL,
            account_updated datetime DEFAULT NULL COMMENT 'User Table',
            PRIMARY KEY (id),
            UNIQUE KEY email_address_UNIQUE (email_address)
          ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;
                        con.query(sql, function (err, result) {
                            if (err) throw err;
                            else {
                                var sql1 = `CREATE TABLE UserDB.Bill (
                                    id VARCHAR(36) NOT NULL COMMENT 'Creating Bill',
                                    created_ts DATETIME NOT NULL,
                                    updated_ts DATETIME NOT NULL,
                                    owner_id VARCHAR(36) NOT NULL,
                                    vendor VARCHAR(60) NOT NULL,
                                    bill_date DATE NOT NULL,
                                    due_date DATE NOT NULL,
                                    amount_due DOUBLE NOT NULL,
                                    paymentStatus ENUM('paid', 'due', 'past_due', 'no_payment_required') NOT NULL,
                                    categories JSON NOT NULL,
                                    attachment JSON NULL DEFAULT NULL,
                                    PRIMARY KEY (id),
                                      FOREIGN KEY (owner_id)
                                      REFERENCES UserDB.User (id));`
                                con.query(sql1, function (err, result) {
                                    if (err) throw err;
                                    else {
                                        console.log('Bill Table created');
                                        var sql2 = `CREATE TABLE UserDB.File (
                                            file_name VARCHAR(255) NOT NULL,
                                            id VARCHAR(255) NOT NULL,
                                            url VARCHAR(255) NOT NULL,
                                            upload_date DATE NOT NULL,
                                            metadata VARCHAR(255) NULL DEFAULT NULL,
                                            PRIMARY KEY (id))
                                            ENGINE = InnoDB
                                            DEFAULT CHARACTER SET = latin1;`
                                        con.query(sql2, function (err, result) {
                                            if (err) throw err;
                                            else {
                                                console.log('File Table created');
                                                process.exit(0);
                                            }
                                        });
                                    }
                                });

                            }
                            console.log("User Table created");
                        });
                    }
                    console.log("Database created");
                });

            }

        });
    }
});