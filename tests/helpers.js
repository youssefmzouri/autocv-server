const {app, server} = require('../index');
const supertest = require('supertest');
const api = supertest(app);

const initialUsers = [
    {
        "email": "youssef@mail.com", 
        "passwordHash": 'encr1pt3dPassword1', 
        "fullName": "Youssef EL Mzouri",
    },
    {
        "email": "youssef2@mail.com", 
        "passwordHash": 'encr1pt3dPassword2', 
        "fullName": "Youssef Derdak",
    }
];

const getAllFromUsers = async () => {
    const response = await api.get('/api/users');
    return {
        emails: response.body.map(user => user.email),
        response
    };
}

module.exports = {
    initialUsers,
    api,
    server,
    getAllFromUsers
}