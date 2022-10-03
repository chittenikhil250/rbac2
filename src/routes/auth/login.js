const router = require('express').Router();
const path = require('path');


router.get('/login', (req, res)=> res.sendFile(path.join(__dirname, '..', '..', 'views', 'login.html')));
router.post('/login', (req, res)=> res.sendFile(path.join(__dirname, '..', 'views', 'login.html')));


module.exports=router;