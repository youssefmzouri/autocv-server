const express = require('express');
const request = require('request');
const server = express();
const env = require('./environment/env-manager').environment();

// usar middlewares
server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.listen(env.SERVER_PORT, () => {
    console.log('Up and running with port', env.SERVER_PORT);
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
            'client_id': env.GIT_CLIENT_ID,
            'client_secret': env.GIT_CLIENT_SECRET,
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