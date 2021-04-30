const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');

usersRouter.get('/', (_, res, next) => {
    console.log(`GET /api/user`);
    User.find({})
    .then(users => {
        res.json(users);
    })
    .catch(error => next(error));
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
    
    if(!email) {
        return res.status(400).json({
            error: 'required "email" field is missing'
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

    const savedUser = await user.save();
    res.json(savedUser);
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

usersRouter.delete('/:id', (req, res, next) => {
    console.log(`Delete /api/user/:id`);
    const {id} = req.params;
    User.findByIdAndRemove(id).then(() => {
        res.status(204).end();
    }).catch(err => next(err));
});

module.exports = usersRouter;