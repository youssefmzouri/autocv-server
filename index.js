require('dotenv').config({path: `./env/${process.env.ENVIRONMENT}/.env`});
require('./mongo');

const express = require('express');
const request = require('request');
const server = express();
const cors = require('cors');
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const port = process.env.PORT || 5000;


const User = require('./models/User');
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');

const usersRouter = require('./controllers/users');

// use middlewares
server.use(cors());
server.use(express.json());
server.use('/images', express.static('images'));

Sentry.init({
    dsn: "https://794168c17a5d45479e03e17182e15071@o587451.ingest.sentry.io/5738698",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ server }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
server.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
server.use(Sentry.Handlers.tracingHandler());

server.get('/', (_, res) => {
    res.send('<h1>Hello world! This is AutoCV.</h1>')
});

server.use('/api/users', usersRouter);

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

// The error handler must be before any other error middleware and after all controllers
server.use(Sentry.Handlers.errorHandler());

server.use(handleErrors);


server.listen(port, () => {
    console.log('Up and running with port', port);
});