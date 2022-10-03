const router = require('express').Router();
const path = require('path');
const user = require('../../models/user');
const {body, validationResult} = require('express-validator');


router.get('/signup', (req, res, next)=> {
    const messages = req.flash();
    res.render('signup', {messages});
});

router.post('/signup',
 [
    body('email').trim().isEmail().withMessage('Email is not valid').normalizeEmail().toLowerCase(),
    body('password').trim().isLength(8).withMessage('Password must be minimum of 8 charecters')
 ] ,
 async(req, res, next)=> {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            errors.array().forEach(err => {
                req.flash(err);
            });
            return;
        }
        const {email} = req.body;
        const alreadyUser = await user.findOne({email: email});
        if(alreadyUser){
            res.redirect('/auth/login');
        }
        else{
            const newUser = new user(req.body);
            await newUser.save();
            res.send(newUser);
        }
    } catch (err) {
        console.error(err);
        throw new Error('cant create new user');
        next(err);
    }
});


module.exports=router;