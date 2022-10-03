const router = require('express').Router();
const path = require('path');
const passport = require('passport');

router.get('/login', (req, res)=> {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureFlash: true,
    failureRedirect: '/auth/login'
}));

router.get('/logout', async(req, res, next)=>{
    req.logout();
    res.redirect('/auth/login');
});

module.exports=router;