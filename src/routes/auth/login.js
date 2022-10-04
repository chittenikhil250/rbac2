const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res)=> {
    req.user ? res.redirect('/user/profile') : res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureFlash: true,
    failureRedirect: '/auth/login',
    failureMessage: true
}));

router.get('/logout', async function(req, res, next){
    req.logout((err) => {
        if (err) { return next(err);}
        req.flash('alert-success', 'You are now logged out!!');
        res.render('login', {messages: req.flash()});
      });
});

module.exports=router;