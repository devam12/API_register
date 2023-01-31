const registerObj = require('../models/model');
const express = require('express');
const router = express.Router()
module.exports = router;
const validatePhoneNumber = require('validate-phone-number-node-js');


router.post('/register', async (req, res) => {

    //Check Phone Number is Valid or Not  
    const phone= req.body.phoneno;
    const result = await validatePhoneNumber.validate(phone);

    if(result){ // Valid Phone no 
        const data = new registerObj({
            name: req.body.name,
            email: req.body.email,
            phoneno: req.body.phoneno,
            status: 0
            //Status pending - false
            //approved - true
        })
        try {
            const dataToSave = await data.save();
            console.log(dataToSave);
            res.status(200).json(dataToSave);
        }
        catch (error) {
            res.status(400).json({message: error.message})
        }
    }
    else{//Invalid Phone no 
        res.status(400).send("Phone number is not valid")
    }
})

router.post('/login', async (req, res) => {
    try{
        console.log(req.body.email);
        var query = {email: req.body.email};
        const findObj  = await registerObj.findOne(query);
        if(findObj.status==true){
            res.send("You have approved by Admin please check your rates ");
        }
        else{
            res.send("You have not approved by admin please wait");
        }
    }
    catch(error){
        res.json({msg: error})
    }
})