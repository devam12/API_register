const registerObj = require('../models/register');
const otpObj = require('../models/otp');
const express = require('express');
const router = express.Router()
module.exports = router;
const otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const axios = require("axios");
const otp = require('../models/otp');
const { findById } = require('../models/register');


router.post('/register', async (req, res) => {

        var query = {email: req.body.email};
        const findObj  = await registerObj.findOne(query);

        //If already register
        if(findObj!=null){
            
            const otpObject  = await otpObj.remove(query);
            const generatedOTP = generateOTP();
            const otpsend = new otpObj({
                email: req.body.email,
                otp: generatedOTP
            })
            // const salt = await bcrypt.genSalt(10)
            // otpsend.otp = await bcrypt.hash(generetedOTP,salt)
            const result  = await otpsend.save()
            sendVerifyMail(req.body.name,req.body.email,generatedOTP)
            res.send("Email is aleady register, Please Login")
        }
        else{
        const data = new registerObj({
            name: req.body.name,
            email: req.body.email,
            status: 0,
            user : []
        })
        try 
        {
            const dataToSave = await data.save();
            const generatedOTP = generateOTP();
            const otpsend = new otpObj({
                email: req.body.email,
                otp: generatedOTP
            })
            // const salt = await bcrypt.genSalt(10)
            // otpsend.otp = await bcrypt.hash(generatedOTP,salt)
            const result  = await otpsend.save()
            sendVerifyMail(req.body.name,req.body.email,generatedOTP)
            console.log(dataToSave);
            console.log(result);
            res.send("Register Succesfully Done, OTP send succesfully please verify email & login")
        }
        catch (error) {
            res.status(400).json({message: error.message})
        }
    }
})




router.post('/addUser', async (req, res) => {

    var query = {email: req.body.email};
    const findObj  = await registerObj.findOne(query);

    //If already register
    if(findObj!=null){
        res.send("Email is aleady register")
    }
    else{       
        try 
        {
            sendMailaddedBySomeone(req.body.name,req.body.email,"Login ID")
            res.send("Email Added Successfully")
        }
        catch (error) {
            res.status(400).json({message: error.message})
        }
    }
})

router.get('/registerusingmail/:sendmailto/:sendname/:sendBy', async (req, res) => {

    var query = {email: req.params.sendmailto};
    const findObj  = await registerObj.findOne(query);

    //If already register
    if(findObj!=null){
        res.send("Email is aleady register")
    }
    else{
        var query = {email: req.params.sendBy};
        const findsenderObj  = await registerObj.findOne(query);
        findsenderObj.user.push(req.params.sendmailto);
        const updatePrimaryUser  = await findsenderObj.save()

        const data = new registerObj({
            name: req.params.sendname,
            email: req.params.sendmailto,
            status: 0,
            user : []
        })
    try 
    {
        const seconderyUserToSave = await data.save();
        const generatedOTP = generateOTP();
        const otpsend = new otpObj({
            email: req.body.email,
            otp: generatedOTP
        })

        const result  = await otpsend.save()
        sendVerifyMail(req.params.sendname,req.params.sendmailto,generatedOTP)
        res.send("You are succesfully register, Please verify email and login")
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}
})



router.get('/login/:OTP', async (req, res) => {
    try{
        var query = {email: req.body.email};
        const findObj  = await otpObj.findOne(query);
        if(findObj==null){
            res.send("OTP Expire....Try Again");
        }
        if(req.params.OTP===findObj.otp){
            const registerObject  = await registerObj.findOne(query);
            const changeStatus = { status: 1 } 
            const updateResponce  = await registerObj.updateOne(registerObject,changeStatus)
            res.send("Your OTP verification successfully...");
        }
        else{
            res.send("Invalid OTP entered...Try Again");
        }
    }
    catch(error){
        res.json({msg: error.message})
    }
})

function generateOTP() {
    const otpGenerat = require('otp-generator')
    const generetedOTP = otpGenerator.generate(4, { alphabets: false, upperCase: false, specialChars: false });
    return generetedOTP;
}

const sendVerifyMail = async (name,toMail,OTP) => {
    try 
        {
            let transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                service : 'Gmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD
                }
            });

            let mailDetails = {
                from: process.env.EMAIL,
                to: toMail,
                subject: 'Verify Mail',
                html: '<p>Dear '+name+'\n\n, OTP for your email verification is : <b>'+OTP+'</b>'
            }
            transport.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log({message: err.message});
                } else {
                    console.log('Email sent successfully -');
                }
            });
        }
        catch(error){
            res.json({msg: error})
        }
}

const sendMailaddedBySomeone = async (name,toMail,sendBy) => {
    try 
        {
            let transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                service : 'Gmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD
                }
            });

            let mailDetails = {
                from: process.env.EMAIL,
                to: toMail,
                subject: 'Invitation Mail from '+sendBy+'',
                html: 'Dear '+name+', You are invited by '+sendBy+' <a href="http://localhost:3000/user/registerusingmail/'+toMail+'/'+name+'/'+sendBy+'">Accept Invitation</a> Thank you'
            }
            transport.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log({message: err.message});
                } else {
                    console.log('Email sent successfully -');
                }
            });
        }
        catch(error){
            res.json({msg: error})
        }
}