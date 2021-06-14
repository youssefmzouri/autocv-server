require('dotenv').config({path: `./env/${process.env.ENVIRONMENT}/.env`});
const {mongoose} = require('./mongo');
const port = process.env.PORT || 5000;
const express = require('express');
const request = require('request');
const app = express();
const cors = require('cors');
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

const User = require('./models/User');
const Curriculum = require('./models/Curriculum');

// import middlewares
const {notFound, handleErrors} = require('./middleware');
const userExtractor = require('./middleware/userExtractor');

// import models and controllers
const {cvsRouter, usersRouter, loginRouter, projectsRouter} = require('./controllers/');

// use middlewares
app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

Sentry.init({
    dsn: "https://794168c17a5d45479e03e17182e15071@o587451.ingest.sentry.io/5738698",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (_, res) => {
    res.send('<h1>Hello world! This is AutoCV.</h1>')
});

// Setting base routes
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use('/api/curriculums', cvsRouter);
app.use('/api/projects', projectsRouter);

app.post('/api/github/authenticate', userExtractor, (req, res, next) => {
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

app.post('/api/github/validate', userExtractor, (req, res, next) => {
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
        'url': 'https://api.github.com',
        'headers': {
            'Authorization': `bearer ${tokenGithub}`,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
        }
    };

    request(options, (error, response) => {
        const {statusCode} = response;
        if (statusCode == 200) {
            // console.log('Github access token valid: ', response.body);
            return res.status(200).json({
                success: true,
                message: 'Token valid!'
            });
        } else {
            console.log('Error validating access token ... ', response.body);
            return res.status(400).json({
                success: false,
                message: 'Token invalid!'
            });
        }
    });
});


app.post('/api/github/user/repositories', userExtractor, (req, res, next) => {
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

app.use(notFound);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(handleErrors);


const server = app.listen(port, () => {
    console.log('Up and running with port: ', port);
});

process.on('exit', () => {
    mongoose.disconnect();
    server.close();
});

module.exports = {
    app,
    server,
    mongoose,
    User,
    Curriculum
};