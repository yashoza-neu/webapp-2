const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRouter = require('./routes/user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/v1/user', usersRouter);

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
    console.log(`Server listening on port: ${PORT}`);
});
  
module.exports = app;
