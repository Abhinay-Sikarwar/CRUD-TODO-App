const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../config');   // from config.js file


// Signup API or route
router.post('/signup', (req, res) => {
    const { name, username, email, password, profilePic } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
    }

    // checking weather user exists in database or not 
    UserModel.findOne({ $or: [{ email }, { username }] })
        .then((userInDB) => {       // if successfull
            if (userInDB) {
                return res.status(500).json({ error: 'User with this email or username already exists! Try Login.', result: { email: email, username: username } });
            }
            bcryptjs.hash(password, 16)
                .then((hashedpassword) => {
                    const user = new UserModel({ name, username, email, password: hashedpassword, profilePic });
                    user.save()
                        .then(() => {
                            res.status(201).json({ result: 'Signup Successful!' });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((error) => {                // if error
            console.log(error);
        })


})



// Login API with JWT token authentication
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
    }

    // checking weather user exists in database or not
    UserModel.findOne({ email: email })  // find if email already in database
        .then((userInDB) => {       // if successful
            if (!userInDB) {
                return res.status(401).json({ error: 'User not found.' });
            }
            bcryptjs.compare(password, userInDB.password)      // change hash to "compare" to compare the password with encrypted password 
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET_KEY);  // _id from user in database
                        const userInfo = { "email": userInDB.email, "name": userInDB.name, "_id": userInDB._id, "username": userInDB.username, "profilePic": userInDB.profilePic }   // extra information of the user (don't include password)

                        return res.status(200).json({ result: { message: 'Login Successful!', token: jwtToken, user: userInfo } });   // token will return jwt token and user will return userInfo stored in above variable

                    }
                    else {
                        return res.status(401).json({ error: 'Invalid credentials. Incorrect password!' });   // if not matched password
                    }
                })
                .catch((err) => {          // if error in comparing password
                    console.log(err);
                })
        })
        .catch((error) => {                // if error
            console.log(error);
        })

})



module.exports = router;

