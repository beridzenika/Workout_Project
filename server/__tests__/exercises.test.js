const request = require('supertest');
const app = require('../app');

//exercise types
describe('POST /exerciseTypes', () => {
    test('should create exercise type', async () => {
        const typeData = {
            name: 'cardio'
        };

        const response = await request(app)
            .post('/exerciseTypes')
            .send(typeData);

        expect(response.status).toBe(201);

        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: typeData.name,
            })
        );
    });
});

describe('GET /exerciseTypes', () => { 
    test('should get all exercise types', async () => { 
        const response = await request(app).get('/exerciseTypes');

        expect(response.status).toBe(200);

        response.body.forEach(exercise => {
            expect(exercise).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                })
            );

        });
     })
});

//muscles
describe('POST /muscles', () => {
    test('should create muscles', async () => {
        const muscleData = [
            {
                name: 'chest',
            },
            {
                name: 'legs',
            }
        ];

       for (const muscle of muscleData) {
            const response = await request(app)
                .post('/muscles')
                .send(muscle);

            expect(response.status).toBe(201);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: muscle.name,
                })
            );
        }
    });
});

describe('GET /muscles', () => { 
    test('should get all exercise types', async () => { 
        const response = await request(app).get('/muscles');

        expect(response.status).toBe(200);

        response.body.forEach(exercise => {
            expect(exercise).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                })
            );

        });
     })
});

//exercises
describe('POST /exercises', () => {
    test('should create exercise', async () => {
        const exerciseData = {
            name: 'Test Push-up',
            type_id: 1,
            default_sets: 4,
            default_reps: 10,
            default_weight: null,
            description: 'Test exercise description',
            progression_from: null,
            progression_to: null,
            muscle_ids: [1, 2],
        };

        const response = await request(app)
            .post('/exercises')
            .send(exerciseData);
        
        expect(response.status).toBe(201);
        
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: 'Test Push-up',
                default_sets: 4,
                default_reps: 10,
                default_weight: null,
                description: 'Test exercise description',
                progression_from: null,
                progression_to: null,
                Muscles: expect.any(Array),
            })
        );

        expect(response.body.Muscles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    name: expect.any(String),
                }),
                expect.objectContaining({
                    id: 2,
                    name: expect.any(String),
                }),
            ])
        )
    });
})

describe('GET exercises', () => { 
    test('should return all exercises', async () => {
        const response = await request(app).get('/exercises');

        expect(response.status).toBe(200);

        expect(response.body).toEqual(
            expect.objectContaining({
                count: expect.any(Number),
                rows: expect.any(Array),
            })
        );

        response.body.rows.forEach(exercise => {
            expect(exercise).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    default_sets: expect.any(Number),
                    default_reps: expect.any(Number),
                    ExerciseType: expect.any(Object),
                    Muscles: expect.any(Array),
                })
            );

        });
    })
});


//TODO: delete apis