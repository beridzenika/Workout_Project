const request = require('supertest');
const app = require('../app');

test('get /exercises', async () => {
    const response = await request(app).get('/exercises');

    expect(response.status).toBe(200);

})