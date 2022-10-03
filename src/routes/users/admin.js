const path = require('path');
const router = require('express').Router();

router.get('/admin', (req, res)=> res.send('admin profile'));

module.exports = router;