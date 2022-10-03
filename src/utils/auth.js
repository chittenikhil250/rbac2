const passport = require('passport');
const local = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
    new local({
        usernameField: "email",
        passwordField: "password"
    }, async(email, password, done)=>{
        try {
            const user = await User.findOne({email});
            if(!user){
                done(null, false, {message: 'You tried to login, Create an account Instead'});
            }
            const isMatch = await user.isValidPassword(password);
            return isMatch ? done(null, user) : done(null, false, {message: 'Incorrect Password'});
        } catch (error) {
            done(error);
        }
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});