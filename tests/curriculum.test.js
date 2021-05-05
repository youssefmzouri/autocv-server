jest.useFakeTimers();
const mongoose = require('mongoose');
const {
    api,
    server
} = require('./helpers');

const Curriculum = require('../models/Curriculum');

describe.skip('GET /api/curriculums', () => {
    test('Return error when try to call a endpoint that do not exist', async () => {
        await api.get('/api/curriculums')
        .expect(404);
    });
});

