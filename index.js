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

/**
 * Des de el front harán click al boton de iniciar sesion con linkedin.
 * Esta logica se encarga linkedin, lo que debemos hacer es actuar como "redirect_uri" con este endpoint.
 * en la url recibiremos el "code" y el "state".
 */
server.get('/user/signin/linkedin/callback', (req, res) => {
    const {query} = req;
    const {code} = query;

    if (!code) {
        return res.send({
            success: false,
            message: 'Error: no code'
        });
    }

    const redirect_uri = encodeURIComponent('http://localhost:5000/user/signin/linkedin/callback');
    const options = {
        'method': 'POST',
        'url': `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&client_id=${env.LINKEDIN_CLIENT_ID}&client_secret=${env.LINKEDIN_CLIENT_SECRET}`,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    request(options, (error, response) => {
        if (error) console.log('Error getting linkedin access token ... ');
        const body = JSON.parse(response.body);
        const access_token = body.access_token;
        // const expires_in = body.expires_in;
        console.log('Linkedin access_token: ', access_token);
    });
});

server.get('/user/signin/github/callback', (req, res) => {
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