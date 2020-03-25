const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRouter = require('./routes/user');
const billRouter = require('./routes/bill');
const log4js = require('log4js');
	log4js.configure({
	  appenders: { logs: { type: 'file', filename: 'logs/webapp.log' } },
	  categories: { default: { appenders: ['logs'], level: 'info' } }
    });
const logger = log4js.getLogger('logs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/v1/user', usersRouter);
app.use('/', usersRouter);
app.use('/v1/bill', billRouter);
app.use('/api/', billRouter);

//error handling
app.use((req, res, next) => {
    const error = new Error('NOT FOUND');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            messsage: error.message
        }
    });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    logger.info("Server started")
    console.log(`Server listening on port: ${PORT}`);
});
module.exports = app;