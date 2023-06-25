import supertest from 'supertest'
import { app } from '../../app'

// app.listen(3000, () => {
//     console.log('test server started')
// })

describe('Profile controller', () => {
    describe('Create user Success Tests', () => {
        test('Valid inputs', async () => {
            //create a user
            const response = await supertest(app)
                .post('/profiles/register')
                .send({
                    email: 'testedemail@gmail.com',
                    username: 'test_user',
                    password: 'password',
                })
                .set('Content-type', 'application/json')

            expect(response.status).toBe(201)

            expect(response.body).toEqual({
                result: {
                    email: 'testedemail@gmail.com',
                    username: 'test_user',
                },
            })
        })
    })
    describe('Create user fail tests', () => {
        test('Invalid email', async () => {
            const response = await supertest(app)
                .post('/profiles/register')
                .send({
                    email: 'invalidemail',
                    username: 'test_user',
                    password: 'password',
                })
                .set('Content-type', 'application/json')

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: ['Email must be a valid email'],
            })
        })

        test('Length of inputs is too short', async () => {
            const response = await supertest(app)
                .post('/profiles/register')
                .send({
                    email: '',
                    username: '',
                    password: '',
                })
                .set('Content-type', 'application/json')

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: [
                    'Email must be a valid email',
                    'Username must be longer than 3 characters',
                    'Password must be longer than 8 characters',
                ],
            })
        })

        test('Length of inputs is too long', async () => {
            const response = await supertest(app)
                .post('/profiles/register')
                .send({
                    email: 'asdasdwasdwawasdwabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwasdwsasdwasdwaswdwasdwawsdxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvasdawasdwasdwasdwasdwasdwasdwasdwasdwadwasdwasdwasdwasdwasdwasdwasdwasdwasdwasdwasdwasdw@gmail.com',
                    username:
                        'asdasdwasdwawasdwabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuv',
                    password:
                        'asdasdwasdwawasdwabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuv',
                })
                .set('Content-type', 'application/json')

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: [
                    'Email must be shorter than 254 characters',
                    'Username must be shorter than 100 characters',
                    'Password must be shorter than 40 characters',
                ],
            })
        })

        test('Invalid input types', async () => {
            const response = await supertest(app)
                .post('/profiles/register')
                .send({
                    email: 11111111111,
                    username: 211111111111,
                    password: 222222222222222222222,
                })
                .set('Content-type', 'application/json')

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: [
                    'Email must be a string',
                    'Username must be a string',
                    'Password must be a string',
                ],
            })
        })

        test('Missing inputs', async () => {
            const response = await supertest(app)
                .post('/profiles/register')
                .send({})
                .set('Content-type', 'application/json')

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: [
                    'Email is required',
                    'Username is required',
                    'Password is required',
                ],
            })
        })
    })

    describe('Login profile success tests', () => {
        test('Valid input', async () => {
            const initResponse = await supertest(app)
                .post('/profiles/register')
                .send({
                    email: 'testuser@gmail.com',
                    username: 'username',
                    password: 'password',
                })
                .set('Content-type', 'application/json')

            expect(initResponse.status).toBe(201)
            expect(initResponse.body).toEqual({
                result: { email: 'testuser@gmail.com', username: 'username' },
            })

            const response = await supertest(app)
                .post('/profiles/login')
                .send({
                    email: 'testuser@gmail.com',
                    password: 'password',
                })
                .set('Content-type', 'application/json')

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                result: { username: 'username', email: 'testuser@gmail.com' },
            })
        })
    })

    describe('Login profile failure tests', () => {
        test('User does not exist', async () => {
            const response = await supertest(app)
                .post('/profiles/login')
                .send({
                    email: 'thisuserdoesnotexist@gmail.com',
                    password: 'password',
                })
                .set('Content-type', 'application/json')

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                error: 'Invalid credentials',
            })
        })

        test('Inputs are too short and inputted email is not an email', async () => {
            const response = await supertest(app)
                .post('/profiles/login')
                .send({
                    email: 'notanemail',
                    password: 'passwo',
                })
                .set('Content-type', 'application/json')

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: [
                    'Email must be a valid email',
                    'Password must be longer than 8 characters',
                ],
            })
        })
    })
    describe('View profile success tests', () => {
        test('Valid inputs', async () => {
            const registerResult = await supertest(app)
                .post('/profiles/register')
                .set('Content-Type', 'application/json')
                .send({
                    email: 'viewprofileuser@gmail.com',
                    password: 'password',
                    username: 'username',
                })

            expect(registerResult.status).toBe(201)
            expect(registerResult.body).toEqual({
                result: {
                    email: 'viewprofileuser@gmail.com',
                    username: 'username',
                },
            })

            const loginResult = await supertest(app)
                .post('/profiles/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: 'viewprofileuser@gmail.com',
                    password: 'password',
                })
            //COOOKIIIES
            const cookies = loginResult.headers['set-cookie']
            expect(cookies).toBeTruthy()
            expect(loginResult.status).toBe(200)
            expect(loginResult.body).toEqual({
                result: {
                    email: 'viewprofileuser@gmail.com',
                    username: 'username',
                },
            })

            const viewProfileResult = await supertest(app)
                .get('/profiles/')
                .set('Cookie', [cookies])
            expect(viewProfileResult.status).toBe(200)
            expect(viewProfileResult.body).toEqual({
                result: {
                    email: 'viewprofileuser@gmail.com',
                    username: 'username',
                },
            })
        })
    })
    describe('View profile fail tests', () => {
        test('Not logged in', async () => {
            const viewProfileResult = await supertest(app).get('/profiles/')
            expect(viewProfileResult.status).toBe(401)
            expect(viewProfileResult.body).toEqual({
                error: 'User is not logged in',
            })
        })
    })
})
