const request = require('supertest');
const app = require('../app');
const { register } = require('../controllers/auth/authController');
const expectCookies = require('supertest/lib/cookies');

const data = {
    username: 'testuser',
    email: 'test@example.com',
    password: '123',
    display_name: 'Test User',
}

describe('POST /auth/register', () => {
    test('registers user and returns accessTocken and user', async () => {        
        const res = await request(app)
            .post('/auth/register')
            .send(data);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body.user).toMatchObject({
            username: data.username,
            email: data.email,
        });
        expect(res.body.user).not.toHaveProperty('password_hash');
        
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0]).toContain('refreshToken');
        expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
    });

    test('returns 409 if email already registered', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: data.username,
                email: data.email,
                password: data.password,
            });
        
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: 'secondUser',
                email: data.email,
                password: data.password,
            });
        
        expect(res.status).toBe(409);
        expect(res.body.message).toMatch(/email/i);
    });

    test('returns 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({email: 'incomplete@ex.com'});
        
            expect(res.status).toBe(400);
    });
});

describe('POST /auth/login', () => {
    beforeAll(async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: data.username,
                email: data.email,
                password: data.password,
            });
    });

    test('login with validation', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: data.email,
                password: data.password,
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    test('returns 401 on wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: data.email,
                password: 'wrong',
            });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    test('returns 401 on wrong email', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'wrong@ex.com',
                password: data.password,
            });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });
});