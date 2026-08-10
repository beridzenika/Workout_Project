require('dotenv').config({path: '.env.test'});

const db = require('../models');

beforeAll(async () => {
    try {
        await db.sequelize.sync({ force: true });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('DATABASE SYNC ERROR:');
        console.error(error);
        throw error;
    }
});

afterAll(async () => {
    await db.sequelize.close();
});