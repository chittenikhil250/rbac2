const express = require('express');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const routes = require('./routes/routes');
const loginRoute = require('./routes/auth/login');
const config = require('./config/config');
const signupRoute = require('./routes/auth/signup');
require('dotenv').config();


const port = process.env.port || 3000;

//initialization and some built in middlewares
const app = express();
app.use(express.urlencoded({extended: false})); 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


//error handler 
app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    res.render('error_40x', { error });
});


//express-session 
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie:{
        // secure: true,
        httpOnly: true,
        maxAge: 14400000
    }
}));

//connect-flash for flash messages
app.use(flash());

//login and signup routes
app.use('/auth', loginRoute);
app.use('/auth', signupRoute);
//handle routes
app.use(routes);



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