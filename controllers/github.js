const githubRouter = require('express').Router();
const {userExtractor} = require('../middleware');
const request = require('request');

githubRouter.post('/authenticate', userExtractor, (req, res, next) => {
    const {code} = req.body;
    const {userId} = req;

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
        if (!error) {
            console.log('Access token: ', response.body);
            return res.status(200).json(response);
        } else {
            console.log('Error getting access token ... ');
            return res.status(400).json(error);
        }
    });
});

githubRouter.post('/validate', userExtractor, (req, res, next) => {
    const {tokenGithub} = req.body;
    const {userId} = req;

    console.log('this is the token', tokenGithub);

    if (!tokenGithub) {
        return res.status(400).json({
            success: false,
            message: 'Error: no tokenGithub provided'
        });
    }

    const options = {
        'method': 'GET',
        'url': 'https://api.github.com',
        'headers': {
            'Authorization': `bearer ${tokenGithub}`,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
        }
    };
    console.log('this is the token 2', tokenGithub);

    request(options, (error, response) => {
        const {statusCode} = response;
        console.log('Error validating access token ... ', response.body);
        if (statusCode == 200) {
            // console.log('Github access token valid: ', response.body);
            return res.status(200).json({
                success: true,
                message: 'Token valid!'
            });
        } else {
            console.log('Error validating access token ... ', response.body);
            if (error) {
                console.log('this is the error when validating token: ', error);
            }
            return res.status(400).json({
                success: false,
                message: 'Token invalid!'
            });
        }
    });
});


githubRouter.post('/user/repositories', userExtractor, (req, res, next) => {
    const {tokenGithub} = req.body;
    const {userId} = req;

    if (!tokenGithub) {
        return res.status(400).json({
            success: false,
            message: 'Error: no tokenGithub provided'
        });
    }

    const options = {
        'method': 'GET',
        'url': 'https://api.github.com/user/repos',
        'headers': {
            'Authorization': `bearer ${tokenGithub}`,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
        }
    };

    request(options, (error, response) => {
        const {statusCode, body} = response;
        if (statusCode == 200) {
            console.log('Repositories returneds: ', body);
            return res.status(200).json(body);
        } else {
            console.log('Error getting repositories ... ', error);
            return res.status(statusCode).json(error);
        }
    });
});

module.exports = githubRouter;