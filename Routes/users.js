const express = require('express')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router();



router.post("/signin", (req, res) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user)
            if (!user) {
                return res.status(401).json({
                    message: "Username or Password doesn't match"
                })
            }
            else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                    }
                    else if (!result) {
                        res.status(401).json({
                            message: "Username or Password doesn't match"
                        })
                    }
                    else {
                        const token = jwt.sign({
                            email: user.email,
                            password: user.password
                        }, process.env.JWT_KEY,
                            {
                                expiresIn: '1h'
                            })
                        res.status(200).json({
                            message: "AUTH successfull",
                            token
                        })
                    }
                })
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post("/signup", async (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: "User exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then(response => {
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

module.exports = router
