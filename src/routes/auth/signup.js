const router = require('express').Router();
const user = require('../../models/user');
const {body, validationResult} = require('express-validator');


router.get('/signup', (req, res, next)=> {
    req.user ? res.redirect('/user/profile') : res.render('signup');
});

router.post('/signup',
 [
    body('email').custom(async(value, {req})=>{
        const alreadyUser = await user.findOne({email: value});
        if(alreadyUser){
            throw new Error('Already registered!!  Login Instead');
        }
        return true;
    }),
    body('email').trim().isEmail().withMessage('Email is not valid').normalizeEmail().toLowerCase(),
    body('password').trim().isLength(8).withMessage('Password must be minimum of 8 charecters'),
    body('password2').custom((value, {req})=>{
        if(value!=req.body.password){
            throw new Error('Passwords do not match');
        }
        return true;
    })
 ],
 async(req, res, next)=> {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            errors.array().forEach(err => {
                const msg = err.msg;
                res.status(400).json({message: msg});
            });
            return;
        }
        const newUser = new user(req.body);
        await newUser.save();
        return res.status(200).json({message: 'Signup Succesfull'});
    } catch (err) {
        console.error(err);
        next(err);
        throw new Error('cant create new user');
    }
});


module.exports=router;