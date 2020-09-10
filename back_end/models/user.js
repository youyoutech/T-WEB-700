const mongoose = require('mongoose');
const schema = mongoose.Schema;
 
const userSchema = new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    },
    preferences: {
        type: [],
        required: false
    }
}, {
    timestamps: true
});

const User = mongoose.model('users', userSchema);

module.exports = User;