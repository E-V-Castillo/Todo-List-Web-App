import supertest from 'supertest'
import { app } from '../../../app'
import clearTestTable from '../../../../test/test_utils/clearTestTables'

afterEach(() => {
    clearTestTable()
})

describe('Create category success test', () => {
    test('Valid input', async () => {
        const loginResponse = await supertest(app)
            .post('/profiles/login')
            .set('Content-type', 'application/json')
            .send({ email: 'user@gmail.com', password: 'password' })
        expect(loginResponse.status).toBe(200)
        const cookies = loginResponse.headers['set-cookie']

        expect(cookies).toBeTruthy()

        const response = await supertest(app)
            .post('/categories/')
            .set('Cookie', [cookies])
            .send({
                name: 'testCategory',
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('result.name', expect.any(String))
        expect(response.body).toHaveProperty(
            'result.category_id',
            expect.any(Number)
        )
    })
})
describe('Create category fail test', () => {
    test('User is not logged in', async () => {
        const response = await supertest(app)
            .post('/categories/')
            .set('Content-type', 'application/json')
            .send({
                name: 'testCategory',
            })

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            error: 'User is not logged in',
        })
    })
    test('Inputs are too long', async () => {
        const loginResponse = await supertest(app)
            .post('/profiles/login')
            .set('Content-type', 'application/json')
            .send({ email: 'user@gmail.com', password: 'password' })
        expect(loginResponse.status).toBe(200)
        const cookies = loginResponse.headers['set-cookie']

        expect(cookies).toBeTruthy()
        const response = await supertest(app)
            .post('/categories/')
            .set('Content-type', 'application/json')
            .set('Cookie', [cookies])
            .send({
                name: 'testCategoryLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum',
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: ['Name must be below 64 characters'],
        })
    })
    test('Inputs are empty', async () => {
        const loginResponse = await supertest(app)
            .post('/profiles/login')
            .set('Content-type', 'application/json')
            .send({ email: 'user@gmail.com', password: 'password' })
        expect(loginResponse.status).toBe(200)
        const cookies = loginResponse.headers['set-cookie']

        expect(cookies).toBeTruthy()
        const response = await supertest(app)
            .post('/categories/')
            .set('Content-type', 'application/json')
            .set('Cookie', [cookies])

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: ['Name of category is required'],
        })
    })
    test('Invalid input type', async () => {
        const loginResponse = await supertest(app)
            .post('/profiles/login')
            .set('Content-type', 'application/json')
            .send({ email: 'user@gmail.com', password: 'password' })
        expect(loginResponse.status).toBe(200)
        const cookies = loginResponse.headers['set-cookie']

        expect(cookies).toBeTruthy()
        const response = await supertest(app)
            .post('/categories/')
            .set('Content-type', 'application/json')
            .set('Cookie', [cookies])
            .send({
                name: { something: 'something' },
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: ['Name must be a string'],
        })
    })
})
