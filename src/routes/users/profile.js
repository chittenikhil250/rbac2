const path = require('path');
const router = require('express').Router();

router.get('/profile', (req, res)=>{
    if(req.user){
        // res.render('profile');
        const user = req.user;
        return res.status(200).json({user});
    }else{
        // req.flash('alert alert-danger alert-dismissible fade show', 'You have to login first')
        // res.render('login', {messages: req.flash()});
        return res.status(401).json({message: 'You need to login first!!'})
    }
});


module.exports = router;