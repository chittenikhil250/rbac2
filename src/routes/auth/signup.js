const router = require('express').Router();
const path = require('path');
const user = require('../../models/user');


router.get('/signup', (req, res)=> res.sendFile(path.join(__dirname, '..', '..', 'views', 'signup.html')));
router.post('/signup', async(req, res, next)=> {
    try {

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