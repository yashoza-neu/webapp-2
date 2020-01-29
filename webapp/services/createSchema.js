const mysql = require('mysql');

//mysql database connection
var con = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD
});

con.connect(function (err) {
    if (err) throw err;
    else {
        console.log("Connected!");
        con.query("DROP DATABASE IF EXISTS "+process.env.DATABASE+";", function (err, result) {
            if (err) throw err;
            else {
                con.query("CREATE DATABASE "+process.env.DATABASE, function (err, result) {
                    if (err) throw err;
                    else {
                        var sql = `CREATE TABLE `+process.env.DATABASE+`.User(
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
                                var sql1 = `CREATE TABLE `+process.env.DATABASE+`.Recipe (
                id varchar(36) NOT NULL COMMENT 'Creating Recipe',
                created_ts datetime NOT NULL,
                updated_ts datetime NOT NULL,
                author_id varchar(36) NOT NULL,
                cook_time_in_min int(11) NOT NULL,
                prep_time_in_min int(11) NOT NULL,
                total_time_in_min int(11) NOT NULL,
                title varchar(60) NOT NULL,
                cusine varchar(45) NOT NULL,
                servings int(11) NOT NULL,
                ingredients json NOT NULL,
                steps json NOT NULL,
                nutrition_information json NOT NULL,
                PRIMARY KEY (id),
                KEY fk_recipe_author_idx (author_id),
                CONSTRAINT fk_recipe_author FOREIGN KEY (author_id) REFERENCES `+process.env.DATABASE+`.User (id) ON DELETE NO ACTION ON UPDATE NO ACTION
              ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;

                                con.query(sql1, function (err, result) {
                                    if (err) throw err;
                                    else {
                                        console.log('Recipe Table created');
                                        process.exit(0);
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