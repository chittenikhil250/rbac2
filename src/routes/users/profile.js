const path = require('path');
const router = require('express').Router();

router.get('/profile', (req, res)=>{
    if(req.user){
        res.render('profile');
    }else{
        req.flash('alert alert-danger alert-dismissible fade show', 'You have to login first')
        res.render('login', {messages: req.flash()});
    }
});


module.exports = router;