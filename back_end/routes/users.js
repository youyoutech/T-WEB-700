const express = require('express');
const route = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var Storage = require('dom-storage');
const ls = new Storage();

let User = require('../models/user');

route.use(cors());

route.post('/register', (req, res) => {
    const userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: 'USER'
    }
    User.findOne({
        username: req.body.username
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    User.create(userData)
                        .then(user => res.json(user.username + ' is registered successfully!'))
                        .catch(err => res.status(400).json('error: ' + err))
                })
            } else {
                res.json({ error: 'User already exists!' })
            }
        })
        .catch(err => {
            res.status(400).json('error: ' + err)
        })
})

route.post('/auth', (req, res) => {
    const userData = {
        firstname: req.body.givenName,
        lastname: req.body.familyName,
        username: req.body.username,
        email: req.body.email,
        password: 'lalalala',
        preferences: [],
        role: 'USER'
    }
    User.findOne({
        email: userData.email
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(userData.password, 10, (err, hash) => {
                    userData.password = hash
                    User.create(userData)
                        .then(user => {
                            const payload = {
                                id: user._id,
                                username: user.username,
                                email: user.email,
                                role: user.role,
                                preferences: user.preferences
                            }
                            jwt.sign({ payload }, 'secretkey', { expiresIn: '12h' }, (err, token) => {
                                if (err) {
                                    res.status(400).json('Error: ' + err)
                                }
                                else {
                                    ls.setItem('token', token)
                                    res.json({ token: token })
                                }
                            })

                        })
                        .catch(err => res.status(400).json('Error: ' + error))
                })
            }
            else {
                const payload = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    preferences: user.preferences
                }
                jwt.sign({ payload }, 'secretkey', { expiresIn: '12h' }, (err, token) => {
                    if (err) {
                        res.status(400).json('Error: ' + err)
                    }
                    else {
                        ls.setItem('token', token)
                        res.json({ token: token })
                    }
                })
            }
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
});

route.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        name: user.lastname,
                        fName: user.firstname,
                        role: user.role,
                        preferences: user.preferences
                    }
                    jwt.sign({ payload }, 'secretkey', { expiresIn: '12h' }, (err, token) => {
                        if (err) {
                            res.json({
                                message: 'error while authentication'
                            });
                        } else {
                            ls.setItem('token', token);
                            res.json({
                                token: token
                            });
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        error: "Wrong password"
                    });
                }
            } else {
                res.json({
                    success: false,
                    error: "User does not exist"
                });
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


route.get('/auth/:provider', () => {
    // AUTH WITH Facebook / Twitter or Google
});

route.get('/auth/:provider/callback', () => {
    // AUTH WITH Facebook / Twitter or Google and retrieve user's information
});

route.post('/logout', (req, res) => {

});

route.get('/profile', (req, res) => {
    jwt.verify(req.headers.authorization, 'secretkey', (err, userInfo) => {
        if (err) {
            console.log(req.headers)
            res.sendStatus(403);
        } else {
            console.log(userInfo)
            User.findOne({ username: userInfo.payload.username }).then(userInfo => {

                res.json({
                    userInfo
                });
            });
        }
    });
});

route.put('/preferences', (req, res) => {
    jwt.verify(req.headers.authorization, 'secretkey', (err, userInfo) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const newDataUser = {
                preferences: req.body.preferences
            }
            console.log(userInfo)
            bcrypt.hash(newDataUser.password, 10, (err, hashed) => {
                User.findByIdAndUpdate({ _id: userInfo.payload.id ? userInfo.payload.id : userInfo.payload._id }, newDataUser)
                    .then(payload => {
                        res.status(200).json('success');

                    })
                    .catch(err => {
                        res.status(400).json('error ' + err);
                    });
            })
        }
    })
});

route.put('/profile', (req, res) => {
    jwt.verify(req.headers.authorization, 'secretkey', (err, userInfo) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const newDataUser = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                preferences: req.body.preferences,
                username: req.body.username ? req.body.username : userInfo.username,
                email: req.body.email ? req.body.email : userInfo.email,
                password: req.body.password ? req.body.password : userInfo.password
            }

            bcrypt.hash(newDataUser.password, 10, (err, hashed) => {
                newDataUser.password = hashed
                User.findByIdAndUpdate({ _id: req.body._id }, newDataUser)
                    .then(payload => {
                        jwt.sign({ payload }, 'secretkey', { expiresIn: '12h' }, (err, token) => {
                            if (err) {
                                res.json({
                                    message: 'error while authentication'
                                });
                            } else {
                                ls.setItem('token', token);
                                res.json({
                                    token: token
                                });
                            }
                        });
                    })
                    .catch(err => {
                        res.status(400).json('error ' + err);
                    });
            })
        }
    })
});

function retrieveToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];

    if (typeof authorizationHeader !== 'undefined') {
        const bearerAuthorisation = authorizationHeader.split(' ');
        req.token = bearerAuthorisation[1];
        next();
    } else {
        res.sendStatus(403);
    }
}
module.exports = route