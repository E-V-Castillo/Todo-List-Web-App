import supertest from 'supertest'
import { app } from '../../../app'
import clearTestTables from '../../../../test/test_utils/clearTestTables'

beforeEach(async () => {
    const loginResponse = await supertest(app)
        .post('/profiles/login')
        .set('Content-type', 'application/json')
        .send({ email: 'user@gmail.com', password: 'password' })
    await supertest(app)
        .post('/categories/')
        .send({ name: 'category' })
        .set('Cookie', [loginResponse.headers['set-cookie']])
})

afterEach(async () => {
    await clearTestTables()
})

describe('Read category success test', () => {
    test('Valid input', async () => {
        const loginResponse = await supertest(app)
            .post('/profiles/login')
            .set('Content-type', 'application/json')
            .send({ email: 'user@gmail.com', password: 'password' })
        expect(loginResponse.status).toBe(200)
        const cookies = loginResponse.headers['set-cookie']

        expect(cookies).toBeTruthy()

        const createResponse = await supertest(app)
            .post('/categories/')
            .set('Cookie', [cookies])
            .send({
                name: 'testCategory',
            })

        expect(createResponse.status).toBe(201)
        expect(createResponse.body).toHaveProperty(
            'result.name',
            expect.any(String)
        )
        expect(createResponse.body).toHaveProperty(
            'result.category_id',
            expect.any(Number)
        )

        const response = await supertest(app)
            .get('/categories/')
            .set('Cookie', [cookies])

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            result: [
                { name: 'category', category_id: expect.any(Number) },
                { name: 'testCategory', category_id: expect.any(Number) },
            ],
        })
    })
})
describe('Read category fail test', () => {
    test('User is not logged in', async () => {
        const response = await supertest(app)
            .get('/categories/')
            .set('Content-type', 'application/json')

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            error: 'User is not logged in',
        })
    })
})
