exports.environment = () => {
    const envJSON = require('./env.json');
    const node_env = process.env.NODE_ENV || 'dev';
    return envJSON[node_env];
}