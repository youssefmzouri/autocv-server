require('dotenv').config({path: `./env/${process.env.ENVIRONMENT}/.env`});
const {mongoose} = require('./mongo');
const port = process.env.PORT || 5000;
const express = require('express');
const app = express();
const cors = require('cors');
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

const User = require('./models/User');
const Curriculum = require('./models/Curriculum');

// import middlewares
const {notFound, handleErrors} = require('./middleware');

// import models and controllers
const {cvsRouter, usersRouter,
    loginRouter, projectsRouter, 
    laboralExperiencesRouter, githubRouter,
    academicExperienceRouter, userProfileRouter,
    profilePictureRouter
} = require('./controllers/');

// use middlewares
app.use(cors());
app.use(express.json({limit: '5mb'}));
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
    res.send('<h1>Hello world! This is AutoCV server</h1>')
});

// Authentication routes
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// Core Routes
app.use('/api/curriculums', cvsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/laboralexperiences', laboralExperiencesRouter);
app.use('/api/academicexperiences', academicExperienceRouter);
app.use('/api/userprofile', userProfileRouter);
app.use('/api/profilePicture', profilePictureRouter);

// Third-Party APIS Routes
app.use('/api/github',githubRouter);

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