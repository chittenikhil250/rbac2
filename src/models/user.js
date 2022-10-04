const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const roles = require('../utils/constants');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: [roles.admin, roles.moderator, roles.client],
            default: roles.client
        },
        name: {
            type: String,
            required: true
        }
    }
);

userSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        if(this.email==process.env.admin){
            this.role=roles.admin;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
});


userSchema.methods.isValidPassword = async function (password){
    try {
        const pwdMatch = await bcrypt.compare(password, this.password);
        return pwdMatch;
    } catch (error) {
        throw createHttpError.InternalServerError(error.message);
    }
}

const user = mongoose.model('user', userSchema);
module.exports = user;