const path = require('path');
const router = require('express').Router();

router.get('/', (req, res)=>{
    const login = req.user;
    if(!login){
        res.redirect('/auth/login');
    }
    else{
        res.sendFile(path.join(__dirname, '..', '..', 'public', '/about.html'));
    }
});
router.get('/about', (req, res)=> res.sendFile(path.join(__dirname, '..', '..', 'public', '/about.html')));
router.get('*', (req, res)=> res.render('NotFound'));

module.exports = router;