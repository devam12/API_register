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
        require : true
    },
    status:{
        type:String,
    }
})

module.exports = mongoose.model('Register', registerSchema)