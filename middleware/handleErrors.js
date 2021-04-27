module.exports = (error, _, response, __) => {
    console.error(error); // TODO: enviar a sentry
    if (error.name === 'CastError') {
        response.status(400).send({
            error: 'id used is malformed'
        });
    } else {
        response.status(500).end();
    }
};