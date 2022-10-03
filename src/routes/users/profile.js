const path = require('path');
const router = require('express').Router();

router.get('/user/profile', (req, res)=> res.send('user profile'));

module.exports = router;