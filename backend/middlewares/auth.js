const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../config');   // config.js file

const UserModel = mongoose.model('UserModel');   // schema


module.exports = (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "User not logged in or not authorized!" })
    }

    const token = authorization.replace("Bearer ", "");


    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
        if (error) {
            return res.status(401).json({ error: "User not logged in or not authorized! (verify error)" });
        }

        const { _id } = payload;
        UserModel.findById(_id)
            .then((dbUser) => {
                req.user = dbUser;
                next();
            })
    })
}




// applying middlewares will stop unauthorized users from accessing the endpoint resources