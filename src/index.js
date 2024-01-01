const express = require('express');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');
var bodyParser = require('body-parser')
const passport = require('passport');
const routes = require('./routes/routes');
const loginRoute = require('./routes/auth/login');
const adminRoute = require('./routes/users/admin');
const userRoute = require('./routes/users/profile');
const config = require('./config/config');
const signupRoute = require('./routes/auth/signup');
require('dotenv').config();


const port = process.env.port || 3000;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

//initialization and some built in middlewares
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false})); 
app.use(cors(corsOptions));
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
    store: MongoStore.create({mongoUrl: config.db_url}),
    cookie:{
        maxAge: 1000*60*60*24,
        httpOnly: true,
        secure: true
    }
}));

//for passport authentication
app.use(passport.initialize());
app.use(passport.session());
require('./utils/auth');


//connect-flash for flash messages
app.use(flash());

//setting the user who logged in 
app.use((req, res, next)=>{
    res.locals.user = req.user;
    res.locals.messages = req.flash();
    next();
})

//login and signup routes
app.use('/auth', loginRoute);
app.use('/auth', signupRoute);
//user routes
app.use('/user', userRoute);
app.use('/user', adminRoute);
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