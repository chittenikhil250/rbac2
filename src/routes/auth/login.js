const router = require('express').Router();
const passport = require('passport');
const {generateToken, verifyToken} = require('../../utils/tokenFunc');


router.get('/login', (req, res)=> {
    req.user ? res.redirect('/user/profile') : res.render('login');
});

router.post('/login', (req, res, next)=>{

    passport.authenticate('local', { session: false }, (err, user, info)=>{
            if(err){
                return next(err);
            }
            if(!user){
                return res.status(400).json({
                    message: 'Invalid Credentials!!'
                })
            }
            const token = generateToken(user);
            res.cookie('token', token,  { httpOnly: true, secure: true });
            return res.status(200).json({
                message: 'Login Succesfull',
                user: user
            })
        }
    )(req, res, next);
});

router.get('/logout', async function(req, res, next){
    try {
        res.clearCookie('token');
        return res.status(200).json({message: 'Logout Succesfull'});
    } catch (error) {
        return next(error);
    }
});

module.exports=router;