const express = require('express');
const route = express.Router();
const User = require('../Models/User');
const fetchUser = require('../Middleware/fetchUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../Helper/NodeMailer')
const otp = require('otp-generator');
const { body, validationResult } = require('express-validator');
const s_key = process.env.JWT_SECRET_KEY;

route.post('/login',
    [body('email').isEmail().withMessage('enter valid email'),
    body('password').isLength({ min: 6 }).withMessage('password should be of minimum length 6')],
    async (req, res) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return res.status(400).send({ err: 'enter valid credentials' })
        }
        try {
            const { email, password } = req.body;
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(404).send({ notFound: 'user not found' });
            }
            const pass = await bcrypt.compare(password, user.password);
            if (!pass) {
                return res.send({ err: 'enter valid credentials' })
            }
            const data = {
                id: user._id,
                city: user.city,
                state: user.state
            }
            const token = jwt.sign(data, '1012020Anu');
            res.json({ token })
        }
        catch (err) {
            return res.status(400).send({ error: 'unexpected error occured' })
        }
    }

)

route.post('/signup',
    [body('name').isLength({ min: 3 }).withMessage('name should be atleast of 3 letters'),
    body('email').isEmail().withMessage('enter valid email'),
    body('password').isLength({ min: 6 }).withMessage('password should be of minimum length 6'),
    body('contact').isLength({ min: 10, max: 10 }).withMessage('contact no. must be of 10 numbers')],
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).send({ err: 'enter valid credentials' });
        }
        try {
            const { name, email, password, city, state, country, contact, pincode, address } = req.body;
            const user = await User.findOne({ email });
            if (user) {
                return res.send({ alreadyExist: 'user with this email id already exist' })
            }
            const salt = await bcrypt.genSalt(10);
            const pass = await bcrypt.hash(password, salt);

            User.create({
                name: name,
                email: email,
                password: pass,
                contact: contact,
                address: address,
                city: city,
                state: state,
                country: country,
                pincode: pincode
            }).then((user) => {
                const data = {
                    id: user._id,
                    city: user.city,
                    state: user.state
                }
                const token = jwt.sign(data, '1012020Anu');
                res.json({ token });
            })
        }
        catch (error) {
            res.status(400).json({ error: 'an unexpected error occured' });
        }
    }
)


route.get('/fetchUser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(400).send({ not_found: "user not found" })
        }
        else {
            res.status(200).send({ data: user })
        }
    }
    catch (error) {
        res.status(400).send({ error: "unexpected error occured" })
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
        res.status(400).send({ error: 'unexpected error occured' });
    }
})


var verificationOtp;
route.get('/sendOtp', [body('emailId').isEmail().withMessage('enter valid email')], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty) {
        res.status(400).send({ invalidId: 'enter valid emailId' });
    }
    let getOtp = otp.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    verificationOtp = getOtp;
    try {
        const { emailId } = req.query;
        let info = await transporter.sendMail({
            from: '"Anushka shukla👻" <anushkashukla3003@gmail.com>', // sender address
            to: `${emailId}`, // list of receivers
            subject: "OTP for verfication ✔", // Subject line
            text: "Hello", // plain text body
            html: `<i> login OTP for your Trofi account : 
            <b> ${getOtp} kindly do not share this OTP with anyone</i>`,
        });
        console.log(info);
        res.status(200).json({ otp: 'otp sent successfully' });
    }

    catch (err) {
        res.status(404).json({ error: 'unexpected error occured' })
    }
}
)


route.post('/verifyOtp', async (req, res) => {
    try {
        const enteredOtp = req.body.enteredOtp;
        const sentOtp = verificationOtp;
        if (enteredOtp === sentOtp) {
            res.status(200).json({ success: 'verified' })
        }
        else {
            res.status(400).json({ fail: 'verification failed' })
        }
        verificationOtp = null;
    }
    catch (err) {
        res.status(404).json({ error: 'unexpected error occured' })
    }

})

route.post('/resetPassword', async (req, res) => {
    try {
        const { password, emailId } = req.body;
        const user = await User.findOne({ email: emailId });
        if (!user) {
            return res.status(404).send({ notFound: 'user with entered emailId not found' });
        }
        const id = user._id;
        const city = user.city;
        const state = user.state;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt)

        const newdata = {}
        newdata.password = hashed;

        const updated = await User.findByIdAndUpdate(id, { $set: newdata }, { new: true });

        if (updated) {
            const data = {
                id: id,
                city: city,
                state: state
            }
            const token = jwt.sign(data, s_key);
            return res.status(200).json({ token })
        }
        else {
            return res.status(401).json({ error: 'can\'t update password' });
        }
    }
    catch (err) {
        res.status(400).json({ error: 'an unexpected error occured' })
    }


})




module.exports = route;
