const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        require : true
    },
    otp:{
        type: String,
        require : true
    },
    createdAt : {
        type: Date,
        default : Date.now,
        index:{
            expires : '300'
        } 
    },

},{timestamps : true})

module.exports = mongoose.model('OTP', otpSchema)