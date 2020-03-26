const mysql = require('mysql');
const log4js = require('log4js');
log4js.configure({
    appenders: { logs: { type: 'file', filename: 'logs/webapp.log' } },
    categories: { default: { appenders: ['logs'], level: 'info' } }
});
const logger = log4js.getLogger('logs');
//mysql database connection
var con = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: 'UserDB'
});

con.connect(function (err) {
    console.log("Connected!");
    logger.log("Connected to DB")
    var sql = `CREATE TABLE IF NOT EXISTS UserDB.User(
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
            var sql1 = `CREATE TABLE IF NOT EXISTS UserDB.Bill (
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
                    var sql2 = `CREATE TABLE IF NOT EXISTS UserDB.File (
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
                            logger.error('File Table created');
                            console.log('File Table created');
                            process.exit(0);
                        }
                    });
                }
            });

        }
        logger.info('User Table created');
        console.log("User Table created");
    });
    logger.error('Database Created');
    console.log("Database created");
});