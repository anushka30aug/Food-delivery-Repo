const express = require('express');
const route = express.Router();
const User = require('../Models/User');
const fetchUser = require('../Middleware/fetchUser');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

route.post('/editProfile', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, contact } = req.body;

        await User.updateOne({ _id: userId }, { $set: { name: name, contact: contact } });
        return res.status(200).send({ updated: 'updated name,contact number successfully' });
    }
    catch (error) {
        return res.status(400).send({ error: 'unexpected error occured' })
    }

})

cloudinary.config(
    {
        cloud_name: 'defnxuihy',
        api_key: '238644135658357',
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    }
)


route.post('/upload', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('upload', req.body)
        const file = req.files.photo;
        cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        
            // to delete the temporary file created
            fs.unlink(file.tempFilePath, (unlinkError) => {
                if (unlinkError) {
                    console.error('Error deleting temporary file:', unlinkError);
                }
            });
            
            if (result) {
                console.log(result)
                await User.updateOne({ _id: userId }, { $set: { profilePicture: result.url } })
                res.status(200).send({ result })
            }
            else {
                res.status(400).send({ error: err })
            }

        })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})


module.exports = route;