const mongoose = require('mongoose');
const registerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneno: {
        type: Number,
    },
    status:{
        type:Boolean,
    }
})

module.exports = mongoose.model('Register', registerSchema)