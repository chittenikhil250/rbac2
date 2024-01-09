const jwt = require('jsonwebtoken');

const generateToken = (user)=>{
    const payLoad = {id: user._id, email: user.email, role: user.role, name: user.name };
    const secret = process.env.secret;
    const options = {expiresIn: '1h'};
    return jwt.sign(payLoad, secret, options);
}

const verifyToken = (token)=>{
    const secret = process.env.secret;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = {generateToken, verifyToken};