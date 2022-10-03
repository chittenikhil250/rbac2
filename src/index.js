const express = require('express');
const cors = require('cors');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const loginRoute = require('./routes/auth/login');
const config = require('./config/config');
const signupRoute = require('./routes/auth/signup');
require('dotenv').config();


const app = express();
const port = process.env.port || 3000;

//handle form data
app.use(express.urlencoded({extended: false})); 
//cors
app.use(cors());
//serve static files and css
app.use(express.static('public'));
//built in middleware for json
app.use(express.json());
//login and signup routes
app.use('/auth', loginRoute);
app.use('/auth', signupRoute);
//handle routes
app.use(routes);
//httperror 
app.use((req, res, next) => {
    next(createHttpError.NotFound());
});
//error handler 
app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    res.render('error_40x', { error });
});


const server = async() => {
    try {
        await mongoose.connect(config.db_url, {
            dbName: config.db_name
        });
        console.log('db connected...');
        app.listen(port, ()=> console.log('app listening on port '+port ));
    } catch (err) {
        console.error(err);
        throw new Error(`couldn't connect to db`);
        server();
    }
}

server();