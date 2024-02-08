const user = require('../../models/user');
const mongoose = require('mongoose');
const router = require('express').Router();
const roles = require('../../utils/constants');
const { verifyToken } = require('../../utils/tokenFunc');

async function roleCheck(req, res, next){
    try {
        const decoded = verifyToken(req.cookies.token);
        const users = await user.find();
        (decoded.role=="admin") ? 
        res.status(200).json(users)
         : res.status(401).json({message : 'Access Denied!!'});
    } catch (error) {
        next(error);
    } 
} 

router.get('/admin', async(req, res, next)=> {
    const token = req.cookies.token;
    console.log(token);
    if(!token) return res.status(401).json({message: 'You need to Login First!!'});
    const decoded = verifyToken(token);
    if(!decoded){
            return res.status(401).json({message: 'Token not Valid!!'});
        }
    else{ 
        roleCheck(req, res, next);
    }
});

router.get('/:id', async(req, res, next)=>{
    try {
        const role = verifyToken(req.cookies.token).role;
        if(role!='admin') return res.status(401).json({message: 'You need to be an admin to View this'});
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Not a Valid User ID!!'})
        }
        const person = await user.findById(id);
        return res.status(200).json({person});
    } catch (err) {
        console.error(err);
        next(err);
    }
});


router.post('/admin/update', async(req, res, next)=>{
    const {id, role} = req.body;
    const decoded = verifyToken(req.cookies.token);
    const users = await user.find();
    if(!id || !role){
        return res.status(401).json({message: 'Invalid Request!!'});
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(401).json({message: 'Invalid Request!!'});
    }
    const rolesArr = Object.values(roles);
    if(!rolesArr.includes(role)){
        return res.status(401).json({message: 'Invalid Request!!'});
    }
    if(decoded.id==id){
        return res.status(400).json({message: 'Ask another admin'});
    }
    const userRole = await user.findById(id);
    if(role==userRole.role){
        return res.status(200).json({message: 'Already a '+{role}});
    }
    else{
        //update role
        const newRoleUser = await user.findByIdAndUpdate(id, {role: role}, {new: true, runValidators: true});
        return res.status(200).json({message: 'Role Changed Succesfully!!', users: await user.find()});
    }
});

module.exports = router;
