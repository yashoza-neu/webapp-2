const mysql = require('../services/db');
const bcrypt = require('bcrypt');

// To authenticate User (Basic Auth)
exports.authenticate = (req, res, next) => {
    //let contentType = req.headers['content-type'];
    // if (contentType == 'application/json') {
        let authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];
        mysql.query('select * from UserDB.User where email_address = (?)', [username], (err, data) => {
            if (data[0] != null) {
                bcrypt.compare(password, data[0].password, (err, result) => {
                    if (result) {
                        const { password, ...userWithoutPassword } = data[0];
                        res.locals.user = userWithoutPassword;
                        next(); // authorized
                    } else {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }
                });

            } else {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        })
    // } else {
    //     return res.status(400).json({ message: 'Bad Request' });
    //}
}
