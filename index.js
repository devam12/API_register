require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin_routes = require('./routes/admin_route');
const user_routes = require('./routes/user_route');


//Middelware
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))  //Show the outpur in postman is required


//Routes
app.use('/admin', admin_routes)
app.use('/user', user_routes)


//Database Connection 
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})


//Start to listening 
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})