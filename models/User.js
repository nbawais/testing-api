const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function () {
    const token = jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return token;
}

UserSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema)