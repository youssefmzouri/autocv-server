const HANDLED_ERRORS = {
    CastError: res => 
        res.status(400).send({error: 'id used is malformed'}),
    
    ValidationError: (res, {message}) => 
        res.status(409).send({error: message}),
    
    JsonWebTokenError: res =>
        res.status(401).json({error: 'token missing or invalid signature'}),
    
    TokenExpiredError: res =>
        res.status(401).json({error: 'token expired'}),  
    
    defaultError: res => res.status(500).end()
}
module.exports = (error, _, res, __) => {
    console.error('Throwed error with name: ', error.name); // TODO: enviar a sentry
    const handler = HANDLED_ERRORS[error.name] || HANDLED_ERRORS.defaultError;
    handler(res, error);
};