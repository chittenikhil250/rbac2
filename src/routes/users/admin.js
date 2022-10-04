const user = require('../../models/user');
const mongoose = require('mongoose');
const router = require('express').Router();


router.get('/admin', async(req, res, next)=> {
    try {
        const users = await user.find();
        (req.user.role=="admin") ? res.render('changeRole', {users: users}) : res.send('Access Denied!!');
    } catch (error) {
        next(error)
    }
});

router.get('/:id', async(req, res, next)=>{
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            req.flash('alert alert-danger alert-dismissible fade show', 'Not a Valid User Id');
            res.render('changeRole', {messsages: req.flash(), users: await user.find()});
            return;
        }
        const person = await user.findById(id);
        res.render('profileTemplate', {user: person});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;