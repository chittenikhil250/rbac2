const path = require('path');
const router = require('express').Router();

router.get('/', (req, res)=> res.send('Hello world'));
router.get('/about', (req, res)=> res.sendFile(path.join(__dirname, '..', '..', 'public', '/about.html')));
router.get('*', (req, res)=> res.sendFile(path.join(__dirname, '..', 'views', '/NotFound.html')));

module.exports = router;