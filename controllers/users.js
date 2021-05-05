const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');

usersRouter.get('/', async (_, res, next) => {
    const users = await User.find({})
    res.status(200).json(users);
});

usersRouter.get('/:id', (req, res, next) => {
    console.log(`GET /api/user/:id`);
    const {id} = req.params;
    User.findById(id)
    .then(user => {
        if (user) {
            return res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
});

usersRouter.post('/', async (req, res, next) => {
    console.log(`POST /api/user`);
    const {body} = req;
    const {email, password, fullName} = body;
    
    if(!email || !password) {
        return res.status(400).json({
            error: '"email" and "password" fields are requireds'
        });
    }
    const saltRounds = 10;
    const passwordHashed = await bcrypt.hash(password, saltRounds);

    const user = new User({
        email: email, 
        passwordHash: passwordHashed,
        fullName: fullName,
        createdAt: new Date().toISOString()
    });

    try{
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch(error) {
        next(error);
    }
});

usersRouter.put('/:id', (req, res, next) => {
    console.log(`PUT /api/user/:id`);
    const {id} = req.params;
    const user = req.body;
    
    const newUserInfo = {
        fullName: user.fullName
    };

    User.findByIdAndUpdate(id, newUserInfo, {new: true})
        .then(savedUser => {
            res.json(savedUser);
        }).catch( err => next(err));
});

usersRouter.delete('/:id', async (req, res, next) => {
    const {id} = req.params;
    await User.findByIdAndRemove(id);
    res.status(204).end();
});

module.exports = usersRouter;