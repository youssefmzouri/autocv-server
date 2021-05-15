const {
    app, server, mongoose,
    User: UserModel,
    Curriculum: CurriculumModel
} = require('../index');
const supertest = require('supertest');
const api = supertest(app);

const initialUsers = [
    {
        "email": "youssef@mail.com", 
        "passwordHash": 'encr1pt3dPassword1', 
        "name": "Youssef",
        "lastName": "El Mzouri"
    },
    {
        "email": "youssef2@mail.com", 
        "passwordHash": 'encr1pt3dPassword2', 
        "name": "Youssef",
        "lastName": "Derdak"
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
    mongoose,
    UserModel,
    CurriculumModel,
    getAllFromUsers
}