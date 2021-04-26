require('dotenv').config({path: `./env/${process.env.ENVIRONMENT}/.env`});
require('./mongo');

const express = require('express');
const request = require('request');
const server = express();

const port = process.env.SERVER_PORT;
const mongoose = require('mongoose')
const User = require('./models/User');


// usar middlewares
server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.listen(port, () => {
    console.log('Up and running with port', port);
});

server.get('/api/user', (_, res) => {
    console.log(`GET /api/user`);
    User.find({})
        .then(result => {
            mongoose.connection.close();
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

server.post('/api/user', (req, res) => {
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
    });
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

server.use((error, _, response, __) => {
    console.error(error);
    if (error.name === 'CastError') {
        response.status(400).end({
            error: 'id used is malformed'
        });
    } else {
        response.status(500).end();
    }
});

// server.get('/api/user', (req, res) => {
//     res.status(200).send([{
//             id: 21,
//             name: "name",
//             age: "30",
//             email: "name@gmail.com"
//         }]);
// });

// server.get('/api/user/:id', (req, res) => {
//     const id = req.params.id;
//     // DO THE SEARCH 
//     res.status(200).send({
//         id: 21,
//         name: "name",
//         age: "30",
//         email: "name@gmail.com"
//     });
// });

// server.post('/api/user/', (req, res) => {
//     const body = req.body;
//     console.log('Usuario ', body);
//     res.status(200).send({"message": `Usuario ${body.user.name} creado `});
// });