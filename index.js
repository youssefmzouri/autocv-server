require('dotenv').config({path: `./env/${process.env.ENVIRONMENT}/.env`});
require('./mongo');

const express = require('express');
const request = require('request');
const server = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');

const User = require('./models/User');

// use middlewares
server.use(cors());
server.use(express.json());

server.get('/api/user', (_, res) => {
    console.log(`GET /api/user`);
    User.find({})
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            console.error(`ERROR GET /api/user`, error);
        })
});

server.get('/api/user/:id', (req, res, next) => {
    console.log(`GET /api/user/:id`);
    const {id} = req.params;
    User.findById(id).then(user => {
        if (user) {
            return res.json(user);
        } else {
            res.status(404).end();
        }
    }).catch(err => {
        next(err)
    });
});

server.post('/api/user', (req, res, next) => {
    console.log(`POST /api/user`);
    const user = req.body;
    
    if(!user.email) {
        return res.status(400).json({
            error: 'required "email" field is missing'
        });
    }

    const newUser = new User({
        email: user.email, 
        password: user.password, 
        fullName: user.fullName,
        createdAt: new Date().toISOString()
    });

    newUser.save().then(savedUser => {
        res.json(savedUser);
    }).catch(error => next(error));
});

server.put('/api/user/:id', (req, res, next) => {
    console.log(`PUT /api/user/:id`);
    const {id} = req.params;
    const user = req.body;
    
    const newUserInfo = {
        fullName: user.fullName
    };

    User.findByIdAndUpdate(id, newUserInfo, {new: true})
        .then(savedUser => {
            res.json(savedUser);
        });
});

server.delete('/api/user/:id', (req, res, next) => {
    console.log(`Delete /api/user/:id`);
    const {id} = req.params;
    User.findByIdAndRemove(id).then(_ => {
        res.status(204).end();
    }).catch(err => {
        next(err)
    });
    res.status(204).end();
});

server.get('/user/signin/github/callback', (req, res, _) => {
    const {query} = req;
    const {code} = query;

    if (!code) {
        return res.send({
            success: false,
            message: 'Error: no code'
        });
    }

    const options = {
        'method': 'POST',
        'url': 'https://github.com/login/oauth/access_token',
        'headers': {
            'Accept': 'application/json'
        },
        formData: {
            'client_id': process.env.GIT_CLIENT_ID,
            'client_secret': process.env.GIT_CLIENT_SECRET,
            'code': code
        }
    };
    request(options, (error, response) => {
        if (error) console.log('Error getting access token ... ');
        console.log('Access token: ', response.body);
    });
});

server.use(notFound);
server.use(handleErrors);

server.listen(port, () => {
    console.log('Up and running with port', port);
});