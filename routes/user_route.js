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
            status: "Pending"
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
        console.log(req.body.phoneno);
        var query = {phoneno: req.body.phoneno};
        const findObj  = await registerObj.findOne(query);
        if(findObj.status=="Approved"){
            res.send("You have Approved by Admin please check your rates ");
        }
        else if(findObj.status=="Pending"){
            res.send("You may still be waiting for approval on the administration side, Your status is 'pending'");
        }
        else{
            res.send("Your profile Unapproved by the administration side");
        }
    }
    catch(error){
        res.json({msg: error})
    }
})