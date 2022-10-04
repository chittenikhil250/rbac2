const user = require('../../models/user');
const mongoose = require('mongoose');
const router = require('express').Router();
const roles = require('../../utils/constants');

async function roleCheck(req, res, next){
    try {
        const users = await user.find();
        (req.user.role=="admin") ? res.render('changeRole', {users: users}) : res.send('Access Denied!!');
    } catch (error) {
        next(error);
    } 
} 

router.get('/admin', async(req, res, next)=> {
    if(!req.user){
            req.flash('alert-danger', 'You have to login first');
            res.render('login', {messages: req.flash()});
        }
    else{
        roleCheck(req, res, next);
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


router.post('/admin/update', async(req, res, next)=>{
    const {id, role} = req.body;
    const users = await user.find();
    if(!id || !role){
        req.flash('alert-danger', 'Invalid Request!! ');
        res.render('changeRole', {messages: req.flash(), users: users});
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        req.flash('alert-danger', 'Invalid request');
        res.render('changeRole', {messages: req.flash(), users: users});
    }
    const rolesArr = Object.values(roles);
    if(!rolesArr.includes(role)){
        req.flash('alert-danger', 'Invalid request');
        res.render('changeRole', {messages: req.flash(), users: users});
    }
    if(req.user.id==id){
        req.flash('alert-danger', 'Ask another admin');
        res.render('changeRole', {messages: req.flash(), users: users});
    }
    const userRole = await user.findById(id);
    if(role==userRole.role){
        req.flash('alert-danger', `Already a ${userRole.role}`);
        res.render('changeRole', {messages: req.flash(), users: users});
    }
    else{
        //update role
        const newRoleUser = await user.findByIdAndUpdate(id, {role: role}, {new: true, runValidators: true});
        req.flash('alert-success', 'Role Changed Sucessfully!!');
        res.render('changeRole', {messages: req.flash(), users: await user.find()});
    }
});

module.exports = router;