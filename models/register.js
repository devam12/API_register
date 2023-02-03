const mongoose = require('mongoose');
const registerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    status:{
        type: Boolean,
    },
    user:{
        type: Array,
    }
})


module.exports = mongoose.model('Register', registerSchema)