const express = require('express');
const bodyParser = require('body-parser');
const server = express();
// const env = require('./environment/env-manager').environment();

// usar middlewares
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

server.listen(3000, () => {
    console.log('HOLA, estoy funcionando');
});

server.get('/user/signin/github/callback', (req, res, next) => {
    res.status(200).send("This is the callback for github api oauth");
});