const registerObj = require('../models/register');
const express = require('express');
const router = express.Router()
module.exports = router;
const validatePhoneNumber = require('validate-phone-number-node-js');

router.post('/approved/:id', async (req, res) => {
    try{
        const findid = {_id : req.params.id}
        const changeStatus = { status: "Approved" } 
        const updateResponce  = await registerObj.updateOne(findid,changeStatus)
        res.send("Your account Approved by Admin side, Please login and check rates");
    }
    catch(error){
        res.json({msg: error})
    }
})


router.post('/unapproved/:id', async (req, res) => {
    try{
        const findid = {_id : req.params.id}
        const beforeStatus   = await registerObj.findById(findid);
        const changeStatus = { status: "Unapproved" } 
        const updateResponce  = await registerObj.updateOne(findid,changeStatus)
        if(beforeStatus.status=="Approved"){
            res.send("Your account suspended by Admin side");
        }
        else{
            res.send("Your account Rejected by Admin side right now in future it will be approved please wait");
        }
    }
    catch(error){
        res.json({msg: error})
    }
})

router.get('/users', async (req, res) => {
    try{
        const responce  = await registerObj.find()
        res.json(responce)
    }
    catch(error){
        res.json({msg: error})
    }
})

