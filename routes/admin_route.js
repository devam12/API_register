const registerObj = require('../models/model');
const express = require('express');
const router = express.Router()
module.exports = router;
const validatePhoneNumber = require('validate-phone-number-node-js');

router.post('/approved/:id', async (req, res) => {
    try{
        const findid = {_id : req.params.id}
        const changeStatus = { status: true } 
        const updateResponce  = await registerObj.updateOne(findid,changeStatus)
        res.status(200).json(updateResponce)
    }
    catch(error){
        res.json({msg: error})
    }
})

router.post('/unapproved/:id', async (req, res) => {
    try{
        const findid = {_id : req.params.id}
        const changeStatus = { status: false } 
        const updateResponce  = await registerObj.updateOne(findid,changeStatus)
        res.status(200).json(updateResponce)
    }
    catch(error){
        res.json({msg: error})
    }
})

