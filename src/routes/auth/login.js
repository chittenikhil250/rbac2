const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res)=> {
    req.user ? res.redirect('/user/profile') : res.render('login');
});

router.post('/login', (req, res, next)=>{

    passport.authenticate('local', (err, user, info)=>{
            
            if(err){
                return next(err);
            }
            if(!user){
                return res.status(400).json({
                    message: 'Invalid Credentials!!'
                })
            }
            req.logIn(user, (err)=>{
                if(err) return next(err);
                req.session.user = user;
                return res.status(200).json({
                    message: 'Login Succesful',
                    user: req.session.user
                }) 
            })
        }
        // {
        // successRedirect: '/user/profile',
        // failureFlash: true,
        // failureRedirect: '/auth/login',
        // failureMessage: true
        // }
    )(req, res, next);
});

router.get('/logout', async function(req, res, next){
    req.logout((err) => {
        if (err) { return next(err);}
        // req.flash('alert-success', 'You are now logged out!!');
        // res.render('login', {messages: req.flash()});
        return res.status(200).json({message: 'Logout Succesfull!!'})
      });
});

module.exports=router;