const express = require('express');
const server = express();
const env = require('./environment/env-manager').environment();

// usar middlewares
server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.listen(env.SERVER_PORT, () => {
    console.log('HOLA, estoy funcionando, port: ', env.SERVER_PORT);
});

server.get('/user/signin/github/callback', (req, res, next) => {
    res.status(200).send("This is the callback for github api oauth");
});