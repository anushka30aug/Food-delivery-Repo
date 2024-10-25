const express = require('express');
const route = express.Router();
const User = require('../Models/User');
const fetchUser = require('../Middleware/fetchUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../Helper/NodeMailer')
const otp = require('otp-generator');
const { body, validationResult } = require('express-validator');
const emailExistence = require('email-existence');
// const s_key = process.env.JWT_SECRET_KEY;


route.get('/fetchUser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(400).send({ not_found: "user not found" })
        }
        else {
            // console.log(user);
            res.status(200).send({ data: user })
        }
    }
    catch (error) {
        res.status(400).send({ error: "Internal server error" })
    }
})


route.get('/fetchUserByEmailId', async (req, res) => {
    try {
        const emailId = req.query.email;
        const user = await User.findOne({ email: emailId });
        if (user) {
            res.send({ alreadyExist: "user with this email id already exist" });
        }
        else {
            res.send({ notExist: 'user with this email ID do not exist' });
        }
    }
    catch (error) {
        res.status(400).send({ error: 'Internal server error' });
    }
})


var verificationOtp;
route.get('/sendOtp', [body('emailId').isEmail().withMessage('enter valid email')], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty) {
        res.status(400).send({ invalidId: 'enter valid emailId' });
    }
    let getOtp = otp.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    verificationOtp = getOtp;
    try {
        const { emailId } = req.query;
        emailExistence.check(emailId, (error, response) => {
            if (error) {
                return res.status(500).json({ error: 'Domain doesnt exist' });
            } 
            // Proceed with sending the email
            transporter.sendMail({
                from: '"Anushka Shukla👻" <anushkashukla3003@gmail.com>', // sender address
                to: emailId, // list of receivers
                subject: "OTP for verification ✔", // Subject line
                text: "Hello", // plain text body
                html: `<i>Sign-In OTP for your Trofi account: <h2>${getOtp}</h2> kindly do not share this OTP with anyone</i>`, // HTML body
            })
            .then(info => {
                // console.log(info);
                res.status(200).json({ otp: 'OTP sent successfully' });
            })
            .catch(error => {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Failed to send OTP' });
            });
        });
    }

    catch (err) {
        res.status(404).json({ error: 'Internal server error' })
    }
}
)


route.post('/verifyOtp', async (req, res) => {
    try {
        const { name, email, enteredOtp} = req.body;
        const sentOtp = verificationOtp;
        if (enteredOtp === sentOtp) {
            // console.log("verified");
            verificationOtp = null;
            const user = await User.findOne({ email });
            if (user) {
                const data={
                    id:user._id
                }
                const token = jwt.sign(data, '1012020Anu');
                return res.send({ success:true, data:token })
            }           
            User.create({
                name: name,
                email: email,
                
            }).then((user) => {
                const data = {
                    id: user._id,
                }
                const token = jwt.sign(data, '1012020Anu');
                return res.send({ success:true, data:token })
            })
        }
        else {
            verificationOtp = null;
            res.status(400).json({ fail: 'verification failed' })
        }
    }
    catch (err) {
        res.status(404).json({ error: 'Internal server error' })
    }

})


module.exports = route;
