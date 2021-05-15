const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const {User} = require('./../models');


// create and manage token.

loginRouter.post('/', async (req, res, next) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);
    
    if ( !(user && passwordCorrect) ) {
        res.status(401).json({
            error: 'invalid user or password'
        });
    }

    const userForToken = {
        email: user.email,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: 60 * 60 * 24 * 7
    });

    res.send({
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        token
    });
});

module.exports = loginRouter;