const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.port || 3000;

//handle form data
app.use(express.urlencoded({extended: false})); 
//cors
app.use(cors());
//serve static files and css
app.use(express.static('public'));
//built in middleware for json
app.use(express.json());

app.get('*', (req, res)=> res.sendFile(path.join(__dirname, 'views', '/NotFound.html')));

app.listen(port, ()=> console.log('app listening on port '+port ));