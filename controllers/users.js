const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const {User} = require('../models');

usersRouter.get('/', async (_, res, next) => {
    try{
        const users = await User.find({}).populate(
            'cvs', {
                name: 1,
                description: 1,
                language: 1
            }
        );
        res.status(200).json(users);
    } catch(error) {
        next(error);
    }
});

usersRouter.get('/:id', (req, res, next) => {
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