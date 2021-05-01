jest.useFakeTimers();
const mongoose = require('mongoose');
const {
    initialUsers,
    api, 
    server,
    getAllFromUsers
} = require('./helpers');

const User = require('../models/User');

beforeEach(async () => {
    await User.deleteMany({});
    for (let i = 0; i < initialUsers.length; i++){
        const newUser = new User(initialUsers[i]);
        await newUser.save();
    }
});

describe('GET /api/users', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        for (let i = 0; i < initialUsers.length; i++){
            const newUser = new User(initialUsers[i]);
            await newUser.save();
        }
    });
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });
    
    test(`there are ${initialUsers.length} users`, async () => {
        const response = await api.get('/api/users');
        expect(response.body).toHaveLength(initialUsers.length);
    });
    
    test('the first user is youssef', async () => {
        const {emails} = await getAllFromUsers();
        expect(emails).toContain('youssef@mail.com');
    });
});

describe('POST /api/users', () => {
    test('A valid user can be added', async () => {
        const newUser = {
            "email": "youssefPOST@mail.com", 
            "password": 'encr1pt3dPassword1', 
            "fullName": "Youssef Chekroun",
        };
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        const {emails, response} = await getAllFromUsers();
        expect(emails).toContain('youssefPOST@mail.com');
        expect(response.body).toHaveLength(initialUsers.length + 1);
    });
    
    test('Add user without email', async () => {
        const newUser = {
            "password": 'encr1pt3dPassword1', 
            "fullName": "Youssef Chekroun",
        };
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        
        const {response} = await getAllFromUsers();
        expect(response.body).toHaveLength(initialUsers.length);
    });
    
    test('Add user without password', async () => {
        const newUser = {
            "email": "youssefPOST@mail.com", 
            "fullName": "Youssef Chekroun",
        };
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        
        const {response} = await getAllFromUsers();
        expect(response.body).toHaveLength(initialUsers.length);
    });
});

describe('Delete /api/users', () => {
    test('A user can be deleted', async () => {
        const {response: firstResponse} = await getAllFromUsers();
        const {body: users} = firstResponse;
        const userToDelete = users[0];
    
        await api
            .delete(`/api/users/${userToDelete.id}`)
            .expect(204); 
    
        const {emails, response: secondResponse} = await getAllFromUsers();
        expect(secondResponse.body).toHaveLength(initialUsers.length - 1);
        expect(emails).not.toContain(userToDelete.email);
    });
    
    test('A user that do not exist can not be deleted', async () => {
        await api
            .delete(`/api/users/1234`)
            .expect(400); 
    
        const {response} = await getAllFromUsers();
        expect(response.body).toHaveLength(initialUsers.length);
    });
});

afterAll( () => {
    mongoose.disconnect();
    server.close();
});