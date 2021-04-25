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

server.get('/api/user', (req, res) => {
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

server.get('/user/signin/github/callback', (req, res, next) => {
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